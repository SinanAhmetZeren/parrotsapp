import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PARROT_IMAGES = [
  require("../assets/game-parrots/benita5-parrot-2509677_small.jpg"),
  require("../assets/game-parrots/bestrongenoughtoletgo-beautiful-macaw-4488679_small.jpg"),
  require("../assets/game-parrots/bestrongenoughtoletgo-rare-parakeets-4462423_small.jpg"),
  require("../assets/game-parrots/biobush-bird-3052985_small.jpg"),
  require("../assets/game-parrots/blumary-bird-7623184_small.jpg"),
  require("../assets/game-parrots/christels-parrot-2796741_small.jpg"),
  require("../assets/game-parrots/christels-parrot-2875363_small.jpg"),
  require("../assets/game-parrots/couleur-parrot-3417217_small.jpg"),
  require("../assets/game-parrots/couleur-parrot-3601194_small.jpg"),
  require("../assets/game-parrots/davidclode-double-eyed-fig-parrot-10256968_small.jpg"),
  require("../assets/game-parrots/davidclode-parrot-9295172_small.jpg"),
  require("../assets/game-parrots/davidclode-parrot-9897724_small.jpg"),
  require("../assets/game-parrots/farka87-eclectus-10154509_small.jpg"),
  require("../assets/game-parrots/jlkramer-cockatiel-4064348_1920_small.jpg"),
  require("../assets/game-parrots/manfredrichter-lorikeet-6969471_small.jpg"),
  require("../assets/game-parrots/rlleslie-parrot-7527071_small.jpg"),
  require("../assets/game-parrots/tirriko-bird-3491624_small.jpg"),
  require("../assets/game-parrots/yancabrera-bird-1823839_small.jpg"),
];

const COLS = 6;
const ROWS = 6;
const TOTAL = COLS * ROWS; // 36 cards = 18 pairs

const CARD_MARGIN = 1;
const MODAL_PADDING = 10; // 3px each side
const CARD_SIZE = Math.floor((SCREEN_WIDTH - MODAL_PADDING - CARD_MARGIN * 2 * COLS) / COLS);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck() {
  const pairs = PARROT_IMAGES.map((img, idx) => [
    { id: idx * 2, imageIdx: idx, image: img },
    { id: idx * 2 + 1, imageIdx: idx, image: img },
  ]).flat();
  return shuffle(pairs);
}

function Card({ card, isFlipped, isMatched, onPress, size }) {
  const anim = useRef(new Animated.Value(isFlipped ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isFlipped || isMatched ? 1 : 0,
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, isMatched]);

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const frontOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const backOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isFlipped || isMatched}
      activeOpacity={0.8}
      style={{ width: size, height: size, margin: CARD_MARGIN }}
    >
      {/* Back */}
      <Animated.View
        style={[
          styles.card,
          { width: size, height: size, transform: [{ rotateY: backRotate }], opacity: backOpacity, position: "absolute" },
          styles.cardBack,
        ]}
      >
        <Image source={require("../assets/ParrotLogoHead.png")} style={{ width: size * 0.5, height: size * 0.5 }} resizeMode="contain" />
      </Animated.View>

      {/* Front */}
      <Animated.View
        style={[
          styles.card,
          { width: size, height: size, transform: [{ rotateY: frontRotate }], opacity: frontOpacity, position: "absolute" },
        ]}
      >
        <Image source={card.image} style={{ width: size, height: size, borderRadius: 6 }} resizeMode="cover" />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function ParrotMemoryGame({ onClose }) {
  const [deck, setDeck] = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const flipBackTimer = useRef(null);

  const handlePress = useCallback((card) => {
    if (flipped.find(c => c.id === card.id) || matched.includes(card.imageIdx)) return;

    if (locked && flipBackTimer.current) {
      clearTimeout(flipBackTimer.current);
      flipBackTimer.current = null;
      setFlipped([card]);
      setLocked(false);
      return;
    }

    if (locked) return;

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      if (a.imageIdx === b.imageIdx) {
        const newMatched = [...matched, a.imageIdx];
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);
        if (newMatched.length === PARROT_IMAGES.length) setWon(true);
      } else {
        flipBackTimer.current = setTimeout(() => {
          setFlipped([]);
          setLocked(false);
          flipBackTimer.current = null;
        }, 1200);
      }
    }
  }, [flipped, matched, locked]);

  const handleRestart = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  if (won) {
    return (
      <View style={styles.wonContainer}>
        <Text style={styles.wonEmoji}>🎉</Text>
        <Text style={styles.wonTitle}>You matched all parrots!</Text>
        <Text style={styles.wonMoves}>Completed in {moves} moves</Text>
        <TouchableOpacity style={styles.btn} onPress={handleRestart}>
          <Text style={styles.btnText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onClose}>
          <Text style={[styles.btnText, { color: "#334155" }]}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 2 }}>
          <Text style={styles.moves}>Moves: {moves}</Text>
        </View>
        <View style={{ flex: 5, alignItems: "flex-start" }}>
          <Text style={styles.progress}>{matched.length}/{PARROT_IMAGES.length} matched</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity onPress={handleRestart} style={styles.restartBtn}>
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.grid}>
        {deck.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={!!flipped.find(c => c.id === card.id)}
            isMatched={matched.includes(card.imageIdx)}
            onPress={() => handlePress(card)}
            size={CARD_SIZE}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f172a",
    alignItems: "center",
    paddingTop: vh(2),
    paddingBottom: vh(1),
    borderRadius: 16,
    width: vw(99),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: vh(1),
    paddingHorizontal: vw(4),
  },
  moves: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  progress: {
    color: "#94a3b8",
    fontSize: 13,
  },
  restartBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#1e40af",
    borderRadius: 8,
    marginRight: 10,
  },
  restartText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#334155",
    borderRadius: 8,
  },
  closeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardBack: {
    backgroundColor: "#1e3a5f",
    borderWidth: 1,
    borderColor: "#2d5a9e",
  },
  cardMatched: {
    borderWidth: 2,
    borderColor: "#22c55e21",
  },
  wonContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  wonEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  wonTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  wonMoves: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 32,
  },
  btn: {
    width: "80%",
    paddingVertical: 14,
    backgroundColor: "#1e40af",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  btnSecondary: {
    backgroundColor: "#e2e8f0",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
