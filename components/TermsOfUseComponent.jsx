import { ParrotsStdText } from "./ParrotsStdText";
import React, { useRef } from "react";
import { ScrollView, View,  StyleSheet, TouchableOpacity } from "react-native";
import { parrotTextDarkBlue } from "../assets/color";
import { TERMS_VERSION } from "../constants/TermsVersion";

const sections = [
    { num: "1.", text: "About Parrots" },
    { num: "2.", text: "Eligibility" },
    { num: "3.", text: "Profile and Content Responsibilities" },
    { num: "4.", text: "Platform Neutrality and No Endorsement" },
    { num: "5.", text: "Voyages and Bids" },
    { num: "6.", text: "Communication Between Users" },
    { num: "7.", text: "Prohibited Activities" },
    { num: "8.", text: "Account Suspension and Termination" },
    { num: "9.", text: "Intellectual Property" },
    { num: "10.", text: "Limitation of Liability" },
    { num: "11.", text: "Disclaimers" },
    { num: "12.", text: "Modifications" },
    { num: "13.", text: "Privacy Policy" },
    { num: "14.", text: "Dispute Resolution" },
    { num: "15.", text: "Governing Law" },
    { num: "16.", text: "Service Termination and Discontinuation" },
    { num: "17.", text: "Refund Policy" },
    { num: "18.", text: "Contact" },
];

export default function TermsOfUseComponent() {
    const scrollRef = useRef(null);
    const sectionRefs = useRef({});

    const scrollToSection = (index) => {
        const ref = sectionRefs.current[index];
        if (ref && scrollRef.current) {
            ref.measureLayout(scrollRef.current, (x, y) => {
                scrollRef.current.scrollTo({ y, animated: true });
            });
        }
    };

    return (
        <ScrollView ref={scrollRef} style={styles.container}>
            <ParrotsStdText style={styles.titleMain}>
                Terms of Use, Privacy Policy & Disclaimer
            </ParrotsStdText>
            <ParrotsStdText style={styles.versionText}>v{TERMS_VERSION}</ParrotsStdText>

            <View style={{ padding: 8 }}>
            <View style={styles.indexContainer}>
                <View style={styles.indexColumns}>
                    <View style={styles.indexColumn}>
                        {sections.slice(0, 8).map((item, i) => (
                            <TouchableOpacity key={i} onPress={() => scrollToSection(i)} style={styles.indexRow}>
                                <ParrotsStdText style={styles.indexNum}>{item.num}</ParrotsStdText>
                                <ParrotsStdText style={styles.indexText}>{item.text}</ParrotsStdText>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.indexColumn}>
                        {sections.slice(8).map((item, i) => (
                            <TouchableOpacity key={i + 8} onPress={() => scrollToSection(i + 8)} style={styles.indexRow}>
                                <ParrotsStdText style={styles.indexNum}>{item.num}</ParrotsStdText>
                                <ParrotsStdText style={styles.indexText}>{item.text}</ParrotsStdText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
            </View>

            {/* 1. About */}
            <View ref={r => sectionRefs.current[0] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>1. About Parrots</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Parrots is a community platform designed to connect users who are
                    interested in sharing information about vehicles, voyages, and related
                    activities. Users can:
                </ParrotsStdText>

                <View style={styles.sectionContainer}>
                    <ParrotsStdText style={styles.sectionTitle2}>a. Create profiles</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Each user can make their own profile page, providing personal
                        information they choose to share, such as a brief bio, social media
                        links, and contact details.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Profiles help other users identify who they are communicating with or
                        interacting with on the platform.
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.sectionTitle2}>b. Upload images</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Users can upload photos to their profile or their listings, such as
                        pictures of themselves, their vehicles, or other relevant content.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots does not review or verify these images, so users are
                        responsible for the content they upload.
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.sectionTitle2}>c. List vehicles and voyages</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Users can add vehicles they own and propose voyages (trips,
                        journeys, or rides) they intend to organize.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Listings may include descriptions, dates, destinations, or other
                        details to inform other users.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots does not verify whether these vehicles exist or whether
                        voyages will actually take place.
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.sectionTitle2}>
                        d. Propose to join others' voyages
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Users can propose to join voyages listed by others, showing interest
                        or proposing participation.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Placing a bid does not create any legal or financial obligation, and
                        Parrots does not enforce or guarantee that the voyage will occur.
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.sectionTitle2}>e. Communicate</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Users can message or interact with each other within the platform.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        All communication is the responsibility of the users themselves.
                        Parrots does not monitor, endorse, or guarantee the safety or
                        truthfulness of these messages.
                    </ParrotsStdText>
                </View>

                <ParrotsStdText style={styles.paragraph}>
                    Users are responsible for the content they post. Parrots does not
                    verify user identities, guarantee voyage completion, or endorse any
                    content.
                </ParrotsStdText>
            </View>

            {/* 2. Eligibility */}
            <View ref={r => sectionRefs.current[1] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>2. Eligibility</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    <ParrotsStdText style={styles.boldText}>Users must be at least 18 years old.</ParrotsStdText> By using Parrots, you confirm that
                    you meet this age requirement and have the legal capacity to enter into
                    this agreement under UK law.
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    By creating an account or continuing to use the platform, you confirm
                    that you have read, understood, and agree to be bound by these Terms.
                    If you do not agree, you must not use the platform.
                </ParrotsStdText>
            </View>

            {/* 3. Profile */}
            <View ref={r => sectionRefs.current[2] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>
                    3. Profile and Content Responsibilities
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Users are responsible for the accuracy and appropriateness of all
                    content they post. Parrots is not responsible for false or misleading
                    content.
                </ParrotsStdText>
                <ParrotsStdText style={[styles.paragraph, styles.boldText]}>
                    User profiles and voyage listings are publicly accessible by anyone with the link, regardless of whether the user has chosen to display them on the public map. Users should not include personal information in their profile or voyage content that they are not comfortable being publicly visible.
                </ParrotsStdText>
            </View>

            {/* 4. Platform Neutrality */}
            <View ref={r => sectionRefs.current[3] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>4. Platform Neutrality and No Endorsement</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Parrots is a technology platform that enables users to list, discover, and bid on voyages and vehicle hire. Parrots does not create, own, operate, or control any voyage, vehicle, or service listed on the platform.
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    We do not verify, approve, endorse, or guarantee:
                </ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• the accuracy or completeness of any listing</ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• the identity, credentials, or reliability of any user</ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• the quality, safety, or legality of any voyage or vehicle offered</ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• that any voyage will depart, arrive, or be completed as described</ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• any transaction, payment, or agreement made between users</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    All arrangements are made solely between the users involved. Parrots is not a party to any agreement, booking, or transaction between users and accepts no liability arising from them.
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Any reliance on listings, user profiles, or content posted by other users is at your own risk.
                </ParrotsStdText>
            </View>

            {/* 5. Voyages */}
            <View ref={r => sectionRefs.current[4] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>5. Voyages and Bids</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Parrots does not guarantee any voyage will occur, be safe, or as
                    described. <ParrotsStdText style={styles.boldText}>Participation is at users' own risk.</ParrotsStdText>
                </ParrotsStdText>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>
                        a. Accepted Bids and Voyage Owner Responsibility
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        When a voyage owner accepts a bid, this constitutes an expression of
                        intent between users only. It does not create a legally binding
                        contract, and Parrots is not a party to any such arrangement.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots does not guarantee that a voyage owner will follow through on
                        an accepted bid, fulfil any stated arrangements, or communicate further
                        after acceptance. Users who have had a bid accepted proceed entirely at
                        their own risk.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots strongly recommends that users:
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.bulletItem}>• Confirm arrangements directly with the voyage owner before making any personal plans</ParrotsStdText>
                    <ParrotsStdText style={styles.bulletItem}>• <ParrotsStdText style={styles.boldText}>Do not make non-refundable bookings or financial commitments based solely on a bid acceptance within the app</ParrotsStdText></ParrotsStdText>
                    <ParrotsStdText style={styles.bulletItem}>• Exercise caution when sharing personal contact details</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots shall not be held liable for any loss, inconvenience, or harm
                        resulting from a voyage owner's failure to proceed following bid
                        acceptance.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        <ParrotsStdText style={styles.boldText}>Note: Parrots does not facilitate payments.</ParrotsStdText> Any financial arrangements
                        made between users occur entirely outside the platform and are the sole
                        responsibility of the parties involved.
                    </ParrotsStdText>
                </View>
            </View>

            {/* 6. Communication */}
            <View ref={r => sectionRefs.current[5] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>6. Communication Between Users</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Parrots allows users to communicate with each other through in-app messaging features.

                    {"\n\n"}
                    Messages may be false, misleading, or inappropriate, and Parrots does not monitor, control, or endorse user communications. Users are solely responsible for the content of their messages.
                </ParrotsStdText>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>
                        a. Message Notifications, Badge, and Read Status (mobile app)
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.paragraph}>
                        Our app includes notification features designed to inform users about new messages. This includes an in-app badge as well as device-level push notifications when the app is in the background or inactive.
                        {"\n\n"}
                        We process message status information (read/unread) to operate messaging features and notification badges.
                        {"\n\n"}
                        The in-app notification badge may appear in the following situations:
                        {"\n"}
                        • When the app is launched, if there are unread messages.
                        {"\n"}
                        • When a new message is received while not actively viewing that conversation.
                        {"\n"}
                        • When the app is reconnected or resumed after being inactive.
                        {"\n\n"}
                        The badge is provided for informational purposes only and may not always reflect exact real-time status. Users are solely responsible for monitoring and reviewing their messages. Parrots does not guarantee that the badge will accurately reflect message status at all times and shall not be held responsible or liable for missed messages, unread messages, delayed badge updates, or any consequences arising from a user's failure to review their messages.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>
                        b. Messages Sent After Bid Acceptance
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.paragraph}>
                        When a user accepts a bid, a message will be sent through the platform's messaging system to the
                        creator of the bid on behalf of the accepting user.
                        {"\n\n"}
                        This message is a direct result of the accepting user's action and is intended to allow users
                        to communicate regarding the relevant voyage or listing.
                        {"\n\n"}
                        This is not a marketing message or notification, but a functional
                        communication necessary for the operation of the service.
                        {"\n\n"}
                        By accepting or placing a bid, users acknowledge and agree that such messages
                        are a core feature of the platform and consent to receiving and sending these communications.
                        {"\n\n"}
                        Parrots does not monitor, verify, or guarantee the content, accuracy, or outcome of these
                        communications. Users are solely responsible for their interactions and any arrangements made.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>
                        c. Message Delivery and Refresh Limitations
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.paragraph}>
                        While the App strives to provide real-time message updates, message delivery and automatic refresh may not always occur immediately, particularly
                        if the App has been idle, the device is in sleep mode, or network conditions are poor. Users are responsible for ensuring that they have an active
                        connection and that the App is open to receive the latest messages.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>
                        d. Message Encryption & Data
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.paragraph}>
                        Messages are encrypted when stored on our servers. However, message content is transmitted to and processed on our servers as plain text before encryption, and is not end-to-end encrypted.
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.paragraph}>
                        <ParrotsStdText style={styles.boldText}>We recommend you do not share sensitive personal information through the messaging feature</ParrotsStdText>, including:
                        {"\n"}• Passwords
                        {"\n"}• Financial details or bank account information
                        {"\n"}• Payment details
                        {"\n"}• Passport or visa information
                        {"\n"}• Identification documents
                        {"\n"}• Phone numbers or email addresses
                        {"\n"}• Home addresses
                        {"\n"}• Current location
                        {"\n"}• Health conditions
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.paragraph}>
                        Message content may be accessed by Parrots staff where required by law or to enforce our policies.
                    </ParrotsStdText>

                    <ParrotsStdText style={styles.paragraph}>
                        Parrots reserves the right to delete messages or conversations at its discretion, including for policy enforcement, storage management purposes, or upon account deletion. Messages may be deleted after a retention period of up to 2 years.
                    </ParrotsStdText>
                </View>

                <View style={{ marginTop: 12 }}>
                    <ParrotsStdText style={styles.sectionTitle2}>e. Group Conversations</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots supports group conversations that allow multiple users to communicate within a shared chat. The following terms apply to group conversations:
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        {"\n"}• Group conversations can be created by any registered user.
                        {"\n"}• The creator of a group conversation is designated as the group administrator and may add or remove members at any time.
                        {"\n"}• All members of a group conversation, including those added after the conversation has begun, have access to the full message history of that group from its creation.
                        {"\n"}• By accepting an invitation to join a group conversation, users acknowledge and consent to viewing messages sent before their membership.
                        {"\n"}• Group administrators are responsible for managing membership and ensuring appropriate use of the group conversation feature.
                        {"\n"}• Parrots does not monitor group conversations but reserves the right to remove content or terminate group conversations that violate our policies.
                    </ParrotsStdText>
                </View>
            </View>

            {/* 7. Prohibited */}
            <View ref={r => sectionRefs.current[6] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>7. Prohibited Activities</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    <ParrotsStdText style={styles.boldText}>Users must not post illegal, harmful, or offensive content; harass or threaten others; or violate intellectual property rights.</ParrotsStdText>
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Users must not:
                </ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• Impersonate any real person, business, or organisation</ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• Create multiple accounts to manipulate listings, bids, or platform visibility</ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• Post content containing external links for commercial or promotional purposes without Parrots' consent</ParrotsStdText>
                <ParrotsStdText style={styles.bulletItem}>• Use the platform to collect personal information from other users for purposes unrelated to genuine voyage participation</ParrotsStdText>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>Content Moderation and Removal</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots reserves the right, but not the obligation, to review, restrict, or
                        remove any voyage, vehicle listing, or related content at its sole
                        discretion. This may include content that appears to be fake, misleading,
                        fraudulent, outdated, inactive for an extended period, or otherwise
                        inconsistent with the purpose of the platform or these Terms.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Removal of content does not imply wrongdoing by the user, and Parrots is not
                        required to provide prior notice, explanation, or justification.
                    </ParrotsStdText>
                </View>
            </View>

            {/* 8. Account Suspension */}
            <View ref={r => sectionRefs.current[7] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>8. Account Suspension and Termination</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    <ParrotsStdText style={styles.boldText}>Parrots reserves the right to suspend, restrict, or permanently terminate any user account at its sole discretion, at any time, without prior notice</ParrotsStdText>, for any reason including but not limited to: breach of these Terms, suspicious activity, prolonged inactivity, or behaviour that Parrots reasonably considers harmful to the platform or its users.
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Terminated users may not re-register without express permission from Parrots.
                </ParrotsStdText>
            </View>

            {/* 9. IP */}
            <View ref={r => sectionRefs.current[8] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>9. Intellectual Property</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Users retain ownership of content they post but grant Parrots a
                    non-exclusive, royalty-free license to display it.
                </ParrotsStdText>
            </View>

            {/* 10. Liability */}
            <View ref={r => sectionRefs.current[9] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>10. Limitation of Liability</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Parrots is not liable for any direct, indirect, incidental, consequential,
                    or special losses or damages arising from use of the platform, including
                    but not limited to loss of data, loss of opportunity, personal injury, or
                    property damage. <ParrotsStdText style={styles.boldText}>To the maximum extent permitted by law, Parrots' total liability to any user shall not exceed zero, as the platform is provided free of charge.</ParrotsStdText>
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Nothing in these Terms excludes or limits liability for death or personal
                    injury caused by negligence, fraud, or any other liability that cannot be
                    excluded under applicable UK law.
                </ParrotsStdText>
            </View>

            {/* 11. Disclaimers */}
            <View ref={r => sectionRefs.current[10] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>11. Disclaimers</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    The platform is provided "as is" without warranties.
                </ParrotsStdText>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>No payments</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots does not facilitate payments or transactions.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>No guarantees</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        <ParrotsStdText style={styles.boldText}>Parrots does not guarantee that any voyage will happen, that users are truthful, or that content is accurate.</ParrotsStdText>
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>No endorsement</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Users and content are not endorsed or verified by Parrots.
                    </ParrotsStdText>
                </View>
            </View>

            {/* 12. Modifications */}
            <View ref={r => sectionRefs.current[11] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>12. Modifications</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Parrots may update these Terms at any time. Where changes are material,
                    Parrots will make reasonable efforts to notify users, such as by displaying
                    a notice within the app or sending an email to the registered address.
                    Continued use of the platform after changes take effect constitutes
                    acceptance of the updated Terms. Users who do not agree to updated Terms
                    should stop using the platform and may request account deletion.
                </ParrotsStdText>
            </View>

            {/* 13. Privacy Policy */}
            <View ref={r => sectionRefs.current[12] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>13. Privacy Policy</ParrotsStdText>

                <ParrotsStdText style={styles.paragraph}>
                    Parrots respects your privacy and is committed to protecting your personal data.
                    This section explains how information is collected, used, stored, and protected
                    when you use the platform.
                </ParrotsStdText>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>a. Information We Collect</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots may collect information that users voluntarily provide, including profile
                        details, images, vehicle and voyage information, messages, and contact details.
                        Users choose what information to share.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots does not verify the accuracy of user-provided information.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>b. Automatically Collected Data</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Limited technical data may be collected automatically, such as device type, app
                        version, error logs, and IP address, for security and service improvement purposes
                        only.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>c. How We Use Data</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Personal data is used solely to operate and maintain the platform, enable user
                        interaction, display content, ensure security, and respond to support requests.
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots does not sell user data and does not use personal data for advertising or
                        profiling.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>d. Legal Basis</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Data is processed based on user consent, contractual necessity, legitimate
                        interests (such as platform security), and legal obligations under UK GDPR.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>e. Data Sharing</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots does not share personal data with third parties for marketing purposes.
                        <ParrotsStdText style={styles.boldText}> Information is visible to other users only where users choose to make it public (e.g., social links and contact details) — except for vehicle and voyage listings, and profile and background images, which are always publicly accessible.</ParrotsStdText>
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots uses trusted third-party infrastructure providers to store and serve data,
                        including file storage and hosting services. These providers act as data processors
                        under UK GDPR and are engaged under appropriate data processing terms. They do not
                        have independent access to your data for their own purposes.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>f. User Communications</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Messages between users are private. Parrots does not actively monitor, verify, or
                        endorse user communications.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>g. Data Retention</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Personal data is retained only as long as necessary to operate the service or
                        comply with legal requirements. Message content may be deleted after a retention
                        period of up to 2 years. Users may request deletion of their account and
                        associated data.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>h. User Rights</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Users have the right to access, correct, delete, or restrict processing of their
                        personal data, and to withdraw consent at any time, in accordance with UK GDPR.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>i. Children's Privacy</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots is not intended for users under the age of 18 and does not knowingly
                        collect data from minors.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>j. Changes to Privacy Policy</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots may update this Privacy Policy from time to time. Continued use of the
                        platform constitutes acceptance of the updated policy.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>k. Local Device Storage</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Parrots may store certain information locally on your device,
                        such as login credentials, preferences, and app settings, to maintain your session and improve functionality.
                        This data is not shared with third parties and can be cleared by you at any time.
                    </ParrotsStdText>
                </View>
            </View>

            {/* 14. Dispute Resolution */}
            <View ref={r => sectionRefs.current[13] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>14. Dispute Resolution</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    In the event of a dispute, users are encouraged to contact Parrots at
                    parrotsapp@gmail.com in the first instance to seek an informal resolution.
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Parrots does not currently participate in any formal Alternative Dispute
                    Resolution (ADR) scheme. Users retain the right to bring claims before a
                    UK court of competent jurisdiction.
                </ParrotsStdText>
            </View>

            {/* 15. Law */}
            <View ref={r => sectionRefs.current[14] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>15. Governing Law</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    These Terms are governed by the laws of the United Kingdom.
                </ParrotsStdText>
            </View>

            {/* 16. Service Termination */}
            <View ref={r => sectionRefs.current[15] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>16. Service Termination and Discontinuation</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Parrots reserves the right to modify, suspend, or permanently discontinue the Service, or any part thereof, at any time and for any reason, with or without prior notice. We shall not be liable to you or any third party for any such modification, suspension, or discontinuation.
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    In the event of permanent discontinuation of the Service, we will make reasonable efforts to provide advance notice. Any unused paid credits (such as ParrotCoins) purchased prior to the discontinuation date will be eligible for a refund, subject to the refund process described in our Refund Policy. We shall have no further obligation beyond such refund.
                </ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    Upon termination or discontinuation, we will retain your data for a period of 30 days, during which you may request a copy of your personal data. After this period, your data may be permanently deleted in accordance with our Privacy Policy.
                </ParrotsStdText>
            </View>

            {/* 17. Refund Policy */}
            <View ref={r => sectionRefs.current[16] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>17. Refund Policy</ParrotsStdText>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>ParrotCoins and Paid Credits</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        ParrotCoins are virtual credits within the Parrots application used to access premium features, such as displaying voyages on the public map.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>Current Status of ParrotCoins</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        ParrotCoins are currently provided free of charge until further notice. No purchase is required at this time. Should operational or infrastructure costs require a transition to a paid model, users will be notified in advance. The refund terms below apply once ParrotCoins become a paid feature.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>General Policy</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        Once ParrotCoins become a paid feature, all purchases will be denominated in Euro (EUR) and made through the applicable app store platform (Apple App Store or Google Play Store). All purchases of ParrotCoins will be final and non-refundable, except in the following circumstances:
                    </ParrotsStdText>
                    <ParrotsStdText style={styles.bulletItem}>• A technical error caused by Parrots resulted in credits not being applied to your account after a successful payment.</ParrotsStdText>
                    <ParrotsStdText style={styles.bulletItem}>• The Service is permanently discontinued, in which case unused ParrotCoins will be refunded as described above.</ParrotsStdText>
                    <ParrotsStdText style={styles.bulletItem}>• Applicable consumer protection law in your jurisdiction grants you a statutory right to a refund that cannot be waived by this policy.</ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>Platform Purchases</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        If you purchase ParrotCoins through the Apple App Store or Google Play Store, refund requests must be submitted directly to Apple or Google in accordance with their respective refund policies. Parrots has no control over and cannot process refunds for purchases made through these platforms.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>How to Request a Refund</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        To request a refund for an eligible purchase, contact us at parrotsapp@gmail.com within 14 days of the purchase date. Please include your registered email address, the date of purchase, and a description of the issue. We will respond within 5 business days.
                    </ParrotsStdText>
                </View>

                <View style={styles.subSection}>
                    <ParrotsStdText style={styles.sectionTitle2}>Unused Credits on Service Discontinuation</ParrotsStdText>
                    <ParrotsStdText style={styles.paragraph}>
                        In the event that Parrots permanently discontinues the Service, users with a remaining ParrotCoin balance will be contacted at the email address associated with their account with instructions for claiming a refund. Refund claims must be submitted within 60 days of the discontinuation notice.
                    </ParrotsStdText>
                </View>
            </View>

            {/* 18. Contact */}
            <View ref={r => sectionRefs.current[17] = r} style={styles.wrapper}>
                <ParrotsStdText style={styles.sectionTitle}>18. Contact</ParrotsStdText>
                <ParrotsStdText style={styles.paragraph}>
                    For questions regarding these Terms:{"\n"}
                    Email: parrotsapp@gmail.com{"\n"}
                    Location: United Kingdom
                </ParrotsStdText>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 8,
    },
    titleMain: {
        fontSize: 22,
        fontFamily: "Nunito_800ExtraBold",
        color: parrotTextDarkBlue,
        textAlign: "center",
        marginTop: 20,
        marginBottom: 4,
    },
    versionText: {
        fontSize: 12,
        fontFamily: "Nunito_700Bold",
        color: "#888",
        textAlign: "center",
        marginBottom: 16,
    },
    wrapper: {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
    },
    indexContainer: {
        backgroundColor: "rgb(246, 246, 246)",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    indexColumns: {
        flexDirection: "row",
    },
    indexColumn: {
        width: "50%",
    },
    indexRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 6,
        marginVertical: 2,
        marginRight: 4,
        backgroundColor: "rgba(0, 53, 128, 0.07)",
        borderRadius: 6,
    },
    indexNum: {
        fontSize: 12,
        fontFamily: "Nunito_800ExtraBold",
        color: parrotTextDarkBlue,
        marginRight: 4,
        minWidth: 22,
    },
    indexText: {
        fontSize: 12,
        fontFamily: "Nunito_700Bold",
        color: parrotTextDarkBlue,
        flexWrap: "wrap",
        flexShrink: 1,
    },
    sectionContainer: {
        marginTop: 8,
        paddingLeft: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: "Nunito_800ExtraBold",
        color: parrotTextDarkBlue,
        marginBottom: 8,
    },
    sectionTitle2: {
        fontSize: 15,
        fontFamily: "Nunito_700Bold",
        color: parrotTextDarkBlue,
        marginTop: 12,
        marginBottom: 4,
    },
    subSection: {
        paddingLeft: 12,
    },
    paragraph: {
        fontSize: 14,
        fontFamily: "Nunito_700Bold",
        color: parrotTextDarkBlue,
        lineHeight: 20,
        marginBottom: 6,
    },
    boldText: {
        fontFamily: "Nunito_800ExtraBold",
        backgroundColor: "rgba(0, 53, 128, 0.11)",
    },
    bulletItem: {
        fontSize: 14,
        fontFamily: "Nunito_700Bold",
        color: parrotTextDarkBlue,
        lineHeight: 20,
        marginBottom: 4,
        paddingLeft: 12,
    },
});
