import { ParrotsStdText } from "./ParrotsStdText";
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
  require("../assets/game-parrots/christels-parrot-2796741_small.jpg"),
  require("../assets/game-parrots/christels-parrot-2875363_small.jpg"),
  require("../assets/game-parrots/couleur-parrot-3417217_small.jpg"),
  require("../assets/game-parrots/couleur-parrot-3601194_small.jpg"),
  require("../assets/game-parrots/davidclode-parrot-9295172_small.jpg"),
  require("../assets/game-parrots/davidclode-parrot-9897724_small.jpg"),
  require("../assets/game-parrots/jlkramer-cockatiel-4064348_1920_small.jpg"),
  require("../assets/game-parrots/manfredrichter-bird-6955201_small.jpg"),
  require("../assets/game-parrots/manfredrichter-lorikeet-6969471_small.jpg"),
  require("../assets/game-parrots/rlleslie-parrot-7527071_small.jpg"),
  require("../assets/game-parrots/tirriko-bird-3491624_small.jpg"),
  require("../assets/game-parrots/yancabrera-bird-1823839_small.jpg"),
  require("../assets/game-parrots/zaidoopro-parrot-6238905_small.jpg"),
  require("../assets/game-parrots/zsolt71-zoo-8378189_small.jpg"),
];

const MODES = {
  "4x4": { cols: 4, pairs: 8, centerIdx: null },
  "5x5": { cols: 5, pairs: 12, centerIdx: 12 },
  "6x6": { cols: 6, pairs: 18, centerIdx: null },
};

const CARD_MARGIN = 1;
const MODAL_PADDING = 10;

function cardSize(cols) {
  return Math.floor((SCREEN_WIDTH - MODAL_PADDING - CARD_MARGIN * 2 * cols) / cols);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(mode) {
  const { pairs, centerIdx } = MODES[mode];
  const images = pairs === PARROT_IMAGES.length
    ? PARROT_IMAGES
    : shuffle([...PARROT_IMAGES]).slice(0, pairs);
  const cards = shuffle(
    images.flatMap((img, idx) => [
      { id: idx * 2, imageIdx: idx, image: img },
      { id: idx * 2 + 1, imageIdx: idx, image: img },
    ])
  );
  if (centerIdx !== null) {
    cards.splice(centerIdx, 0, { id: -1, imageIdx: -1, isLogo: true });
  }
  return cards;
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

  if (card.isLogo) {
    return (
      <View style={[styles.card, styles.logoTile, { width: size, height: size, margin: CARD_MARGIN }]}>
        <Image source={require("../assets/parrotsiconpaddedtransparent.png")} style={{ width: size, height: size }} resizeMode="contain" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isFlipped || isMatched}
      activeOpacity={0.8}
      style={{ width: size, height: size, margin: CARD_MARGIN }}
    >
      <Animated.View
        style={[
          styles.card,
          { width: size, height: size, transform: [{ rotateY: backRotate }], opacity: backOpacity, position: "absolute" },
          styles.cardBack,
        ]}
      >
        <Image source={require("../assets/ParrotLogoHead.png")} style={{ width: size * 0.35, height: size * 0.35 }} resizeMode="contain" />
      </Animated.View>
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

function ModeSelector({ onSelect, onClose }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={[styles.closeBtn,
      { position: "absolute", top: -15, right: -3, zIndex: 10 }]}>
        <ParrotsStdText style={styles.closeText}>✕</ParrotsStdText>
      </TouchableOpacity>
      <ParrotsStdText style={styles.tagline}>Match the parrots before your next voyage</ParrotsStdText>
      <View style={styles.modeSelectorContainer}>
        {["4x4", "5x5", "6x6"].map((m) => (
          <TouchableOpacity key={m} style={styles.modeBtn} onPress={() => onSelect(m)}>
            <ParrotsStdText style={styles.modeBtnText}>{m}</ParrotsStdText>
            <ParrotsStdText style={styles.modeBtnSub}>
              {m === "4x4" ? "8 pairs" : m === "5x5" ? "12 pairs" : "18 pairs"}
            </ParrotsStdText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function ParrotMemoryGame({ onClose }) {
  const [mode, setMode] = useState(null);
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const flipBackTimer = useRef(null);

  const startGame = (m) => {
    setMode(m);
    setDeck(buildDeck(m));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  const handlePress = useCallback((card) => {
    if (flipped.find(c => c.id === card.id) || matched.includes(card.imageIdx)) return;

    if (locked && flipBackTimer.current) {
      clearTimeout(flipBackTimer.current);
      flipBackTimer.current = null;
      setFlipped([]);
      setTimeout(() => {
        setFlipped([card]);
        setLocked(false);
      }, 50);
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
        if (newMatched.length === MODES[mode].pairs) setTimeout(() => setWon(true), 2000);
      } else {
        flipBackTimer.current = setTimeout(() => {
          setFlipped([]);
          setLocked(false);
          flipBackTimer.current = null;
        }, 1200);
      }
    }
  }, [flipped, matched, locked, mode]);

  if (!mode) {
    return <ModeSelector onSelect={startGame} onClose={onClose} />;
  }

  const size = cardSize(MODES[mode].cols);
  const totalPairs = MODES[mode].pairs;

  if (won) {
    return (
      <View style={styles.wonContainer}>
        <ParrotsStdText style={styles.wonEmoji}>🎉</ParrotsStdText>
        <ParrotsStdText style={styles.wonTitle}>You matched all parrots!</ParrotsStdText>
        <ParrotsStdText style={styles.wonMoves}>Completed in {moves} moves</ParrotsStdText>
        <TouchableOpacity style={styles.btn} onPress={() => setMode(null)}>
          <ParrotsStdText style={styles.btnText}>Play Again</ParrotsStdText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onClose}>
          <ParrotsStdText style={[styles.btnText, { color: "#334155" }]}>Close</ParrotsStdText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={{ position: "absolute", top: -15, right: 2, zIndex: 10 }}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <ParrotsStdText style={styles.closeText}>✕</ParrotsStdText>
        </TouchableOpacity>
      </View>

      <ParrotsStdText style={styles.tagline}>Match the parrots before your next voyage</ParrotsStdText>
      <View style={styles.header}>
        <View style={{ flex: 1, alingItems: "flex-end" }}>
          <ParrotsStdText style={styles.moves}>Moves: {moves}</ParrotsStdText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <ParrotsStdText style={styles.progress}>{matched.length}/{totalPairs} matched</ParrotsStdText>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity onPress={() => setMode(null)} style={styles.restartBtn}>
            <ParrotsStdText style={styles.restartText}>Restart</ParrotsStdText>
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
            size={size}
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
  tagline: {
    color: "#ffffff",
    fontSize: 16,
    letterSpacing: 0.4,
    marginBottom: vh(0.8),
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
  },
  modeSelectorContainer: {
    flexDirection: "row",
    gap: 16,
    marginVertical: vh(4),
  },
  modeBtn: {
    backgroundColor: "#1e3a5f",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2d5a9e",
  },
  modeBtnText: {
    color: "white",
    fontSize: 22,
    fontFamily: "Nunito_700Bold",
  },
  modeBtnSub: {
    color: "#94a3b8",
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
    marginTop: 4,
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
    fontFamily: "Nunito_700Bold",
    marginRight: 10,
    textAlign: "center",
  },
  progress: {
    color: "#94a3b8",
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
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
    fontFamily: "Nunito_700Bold",
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
    fontFamily: "Nunito_700Bold",
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
  logoTile: {
    backgroundColor: "#1e3a5f",
    borderWidth: 1,
    borderColor: "#2d5a9e",
  },
  wonContainer: {
    height: vh(50),
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 16,
    width: vw(99),
  },
  wonEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  wonTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  wonMoves: {
    color: "#94a3b8",
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
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
    fontFamily: "Nunito_700Bold",
  },
});
