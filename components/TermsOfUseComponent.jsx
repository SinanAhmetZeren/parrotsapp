import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { parrotTextDarkBlue } from "../assets/color";

export default function TermsOfUseComponent() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titleMain}>
                Terms of Use, Privacy Policy & Disclaimer
            </Text>

            {/* 1. About */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>1. About Parrots</Text>
                <Text style={styles.paragraph}>
                    Parrots is a community platform designed to connect users who are
                    interested in sharing information about vehicles, voyages, and related
                    activities. Users can:
                </Text>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle2}>a. Create profiles</Text>
                    <Text style={styles.paragraph}>
                        Each user can make their own profile page, providing personal
                        information they choose to share, such as a brief bio, social media
                        links, and contact details.
                    </Text>
                    <Text style={styles.paragraph}>
                        Profiles help other users identify who they are communicating with or
                        interacting with on the platform.
                    </Text>

                    <Text style={styles.sectionTitle2}>b. Upload images</Text>
                    <Text style={styles.paragraph}>
                        Users can upload photos to their profile or their listings, such as
                        pictures of themselves, their vehicles, or other relevant content.
                    </Text>
                    <Text style={styles.paragraph}>
                        Parrots does not review or verify these images, so users are
                        responsible for the content they upload.
                    </Text>

                    <Text style={styles.sectionTitle2}>c. List vehicles and voyages</Text>
                    <Text style={styles.paragraph}>
                        Users can add vehicles they own and propose voyages (trips,
                        journeys, or rides) they intend to organize.
                    </Text>
                    <Text style={styles.paragraph}>
                        Listings may include descriptions, dates, destinations, or other
                        details to inform other users.
                    </Text>
                    <Text style={styles.paragraph}>
                        Parrots does not verify whether these vehicles exist or whether
                        voyages will actually take place.
                    </Text>

                    <Text style={styles.sectionTitle2}>
                        d. Propose to join others' voyages
                    </Text>
                    <Text style={styles.paragraph}>
                        Users can propose to join voyages listed by others, showing interest
                        or proposing participation.
                    </Text>
                    <Text style={styles.paragraph}>
                        Placing a bid does not create any legal or financial obligation, and
                        Parrots does not enforce or guarantee that the voyage will occur.
                    </Text>

                    <Text style={styles.sectionTitle2}>e. Communicate</Text>
                    <Text style={styles.paragraph}>
                        Users can message or interact with each other within the platform.
                    </Text>
                    <Text style={styles.paragraph}>
                        All communication is the responsibility of the users themselves.
                        Parrots does not monitor, endorse, or guarantee the safety or
                        truthfulness of these messages.
                    </Text>
                </View>

                <Text style={styles.paragraph}>
                    Users are responsible for the content they post. Parrots does not
                    verify user identities, guarantee voyage completion, or endorse any
                    content.
                </Text>
            </View>

            {/* 2. Eligibility */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>2. Eligibility</Text>
                <Text style={styles.paragraph}>
                    Users must be at least 18 years old. By using Parrots, you confirm that
                    you meet this age requirement and have the legal capacity to enter into
                    this agreement under UK law.
                </Text>
                <Text style={styles.paragraph}>
                    By creating an account or continuing to use the platform, you confirm
                    that you have read, understood, and agree to be bound by these Terms.
                    If you do not agree, you must not use the platform.
                </Text>
            </View>

            {/* 3. Profile */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>
                    3. Profile and Content Responsibilities
                </Text>
                <Text style={styles.paragraph}>
                    Users are responsible for the accuracy and appropriateness of all
                    content they post. Parrots is not responsible for false or misleading
                    content.
                </Text>
            </View>

            {/* 4. Platform Neutrality */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>4. Platform Neutrality and No Endorsement</Text>
                <Text style={styles.paragraph}>
                    Parrots is a technology platform that enables users to list, discover, and bid on voyages and vehicle hire. Parrots does not create, own, operate, or control any voyage, vehicle, or service listed on the platform.
                </Text>
                <Text style={styles.paragraph}>
                    We do not verify, approve, endorse, or guarantee:{"\n"}
                    {"  "}• the accuracy or completeness of any listing{"\n"}
                    {"  "}• the identity, credentials, or reliability of any user{"\n"}
                    {"  "}• the quality, safety, or legality of any voyage or vehicle offered{"\n"}
                    {"  "}• that any voyage will depart, arrive, or be completed as described{"\n"}
                    {"  "}• any transaction, payment, or agreement made between users
                </Text>
                <Text style={styles.paragraph}>
                    All arrangements are made solely between the users involved. Parrots is not a party to any agreement, booking, or transaction between users and accepts no liability arising from them.
                </Text>
                <Text style={styles.paragraph}>
                    Any reliance on listings, user profiles, or content posted by other users is at your own risk.
                </Text>
            </View>

            {/* 5. Voyages */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>5. Voyages and Bids</Text>
                <Text style={styles.paragraph}>
                    Parrots does not guarantee any voyage will occur, be safe, or as
                    described. Participation is at users' own risk.
                </Text>

                <Text style={styles.sectionTitle2}>
                    a. Accepted Bids and Voyage Owner Responsibility
                </Text>
                <Text style={styles.paragraph}>
                    When a voyage owner accepts a bid, this constitutes an expression of
                    intent between users only. It does not create a legally binding
                    contract, and Parrots is not a party to any such arrangement.
                </Text>
                <Text style={styles.paragraph}>
                    Parrots does not guarantee that a voyage owner will follow through on
                    an accepted bid, fulfil any stated arrangements, or communicate further
                    after acceptance. Users who have had a bid accepted proceed entirely at
                    their own risk.
                </Text>
                <Text style={styles.paragraph}>
                    Parrots strongly recommends that users:{"\n"}
                    {"  "}• Confirm arrangements directly with the voyage owner before
                    making any personal plans{"\n"}
                    {"  "}• Do not make non-refundable bookings or financial commitments
                    based solely on a bid acceptance within the app{"\n"}
                    {"  "}• Exercise caution when sharing personal contact details
                </Text>
                <Text style={styles.paragraph}>
                    Parrots shall not be held liable for any loss, inconvenience, or harm
                    resulting from a voyage owner's failure to proceed following bid
                    acceptance.
                </Text>
                <Text style={styles.paragraph}>
                    Note: Parrots does not facilitate payments. Any financial arrangements
                    made between users occur entirely outside the platform and are the sole
                    responsibility of the parties involved.
                </Text>
            </View>

            {/* 6. Communication */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>6. Communication Between Users</Text>
                <Text style={styles.paragraph}>
                    Parrots allows users to communicate with each other through in-app messaging features.

                    {"\n\n"}
                    Messages may be false, misleading, or inappropriate, and Parrots does not monitor, control, or endorse user communications. Users are solely responsible for the content of their messages.
                </Text>

                <Text style={styles.sectionTitle2}>
                    a. Message Notifications, Badge, and Read Status (mobile app)
                </Text>

                <Text style={styles.paragraph}>
                    Our app includes an in-app notification badge designed to inform users about new messages. This badge appears only within the app interface and is not a device-level or operating system notification.
                    {"\n\n"}
                    We process message status information (read/unread) to operate messaging features and notification badges.
                    {"\n\n"}
                    The in-app notification badge may appear in the following situations:
                    {"\n"}
                    • When the app is launched, if there are unread messages.
                    {"\n"}
                    • When a new message is received while using screens other than the Messages screen.
                    {"\n"}
                    • When the Messages screen is opened, messages may be automatically marked as read and the badge cleared.
                    {"\n\n"}
                    The badge is provided for informational purposes only and may not always reflect exact real-time status. Users are solely responsible for monitoring and reviewing their messages. Parrots does not guarantee that the badge will accurately reflect message status at all times and shall not be held responsible or liable for missed messages, unread messages, delayed badge updates, or any consequences arising from a user's failure to review their messages.
                </Text>

                <Text style={styles.sectionTitle2}>
                    b. Messages Sent After Bid Acceptance
                </Text>

                <Text style={styles.paragraph}>
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
                </Text>

                <Text style={styles.sectionTitle2}>
                    c. Message Delivery and Refresh Limitations
                </Text>

                <Text style={styles.paragraph}>
                    While the App strives to provide real-time message updates, message delivery and automatic refresh may not always occur immediately, particularly
                    if the App has been idle, the device is in sleep mode, or network conditions are poor. Users are responsible for ensuring that they have an active
                    connection and that the App is open to receive the latest messages.
                </Text>

                <Text style={styles.sectionTitle2}>
                    d. Message Encryption & Data
                </Text>

                <Text style={styles.paragraph}>
                    Messages are encrypted when stored on our servers. However, message content is transmitted to and processed on our servers as plain text before encryption, and is not end-to-end encrypted.
                </Text>

                <Text style={styles.paragraph}>
                    We recommend you do not share sensitive personal information through the messaging feature, including:
                    {"\n"}• Passwords
                    {"\n"}• Financial details or bank account information
                    {"\n"}• Payment details
                    {"\n"}• Passport or visa information
                    {"\n"}• Identification documents
                    {"\n"}• Phone numbers or email addresses
                    {"\n"}• Home addresses
                    {"\n"}• Current location
                    {"\n"}• Health conditions
                </Text>

                <Text style={styles.paragraph}>
                    Message content may be accessed by Parrots staff where required by law or to enforce our policies.
                </Text>

                <Text style={styles.paragraph}>
                    Parrots reserves the right to delete messages or conversations at its discretion, including for policy enforcement, storage management purposes, or upon account deletion. Messages may be deleted after a retention period of up to 2 years.
                </Text>
            </View>

            {/* 7. Prohibited */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>7. Prohibited Activities</Text>
                <Text style={styles.paragraph}>
                    Users must not post illegal, harmful, or offensive content; harass or
                    threaten others; or violate intellectual property rights.
                </Text>
                <Text style={styles.paragraph}>
                    Users must not:{"\n"}
                    {"  "}• Impersonate any real person, business, or organisation{"\n"}
                    {"  "}• Create multiple accounts to manipulate listings, bids, or platform visibility{"\n"}
                    {"  "}• Post content containing external links for commercial or promotional purposes without Parrots' consent{"\n"}
                    {"  "}• Use the platform to collect personal information from other users for purposes unrelated to genuine voyage participation
                </Text>

                <Text style={styles.sectionTitle2}>Content Moderation and Removal</Text>
                <Text style={styles.paragraph}>
                    Parrots reserves the right, but not the obligation, to review, restrict, or
                    remove any voyage, vehicle listing, or related content at its sole
                    discretion. This may include content that appears to be fake, misleading,
                    fraudulent, outdated, inactive for an extended period, or otherwise
                    inconsistent with the purpose of the platform or these Terms.
                </Text>
                <Text style={styles.paragraph}>
                    Removal of content does not imply wrongdoing by the user, and Parrots is not
                    required to provide prior notice, explanation, or justification.
                </Text>
            </View>

            {/* 8. Account Suspension */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>8. Account Suspension and Termination</Text>
                <Text style={styles.paragraph}>
                    Parrots reserves the right to suspend, restrict, or permanently terminate
                    any user account at its sole discretion, at any time, without prior notice,
                    for any reason including but not limited to: breach of these Terms,
                    suspicious activity, prolonged inactivity, or behaviour that Parrots
                    reasonably considers harmful to the platform or its users.
                </Text>
                <Text style={styles.paragraph}>
                    Terminated users may not re-register without express permission from Parrots.
                </Text>
            </View>

            {/* 9. IP */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
                <Text style={styles.paragraph}>
                    Users retain ownership of content they post but grant Parrots a
                    non-exclusive, royalty-free license to display it.
                </Text>
            </View>

            {/* 10. Liability */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
                <Text style={styles.paragraph}>
                    Parrots is not liable for any direct, indirect, incidental, consequential,
                    or special losses or damages arising from use of the platform, including
                    but not limited to loss of data, loss of opportunity, personal injury, or
                    property damage. To the maximum extent permitted by law, Parrots' total
                    liability to any user shall not exceed zero, as the platform is provided
                    free of charge.
                </Text>
                <Text style={styles.paragraph}>
                    Nothing in these Terms excludes or limits liability for death or personal
                    injury caused by negligence, fraud, or any other liability that cannot be
                    excluded under applicable UK law.
                </Text>
            </View>

            {/* 11. Disclaimers */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>11. Disclaimers</Text>
                <Text style={styles.paragraph}>
                    The platform is provided "as is" without warranties.
                </Text>

                <Text style={styles.sectionTitle2}>No payments</Text>
                <Text style={styles.paragraph}>
                    Parrots does not facilitate payments or transactions.
                </Text>

                <Text style={styles.sectionTitle2}>No guarantees</Text>
                <Text style={styles.paragraph}>
                    Parrots does not guarantee accuracy or truthfulness of users.
                </Text>

                <Text style={styles.sectionTitle2}>No endorsement</Text>
                <Text style={styles.paragraph}>
                    Users and content are not endorsed or verified by Parrots.
                </Text>
            </View>

            {/* 12. Modifications */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>12. Modifications</Text>
                <Text style={styles.paragraph}>
                    Parrots may update these Terms at any time. Where changes are material,
                    Parrots will make reasonable efforts to notify users, such as by displaying
                    a notice within the app or sending an email to the registered address.
                    Continued use of the platform after changes take effect constitutes
                    acceptance of the updated Terms. Users who do not agree to updated Terms
                    should stop using the platform and may request account deletion.
                </Text>
            </View>

            {/* 13. Privacy Policy */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>13. Privacy Policy</Text>

                <Text style={styles.paragraph}>
                    Parrots respects your privacy and is committed to protecting your personal data.
                    This section explains how information is collected, used, stored, and protected
                    when you use the platform.
                </Text>

                <Text style={styles.sectionTitle2}>a. Information We Collect</Text>
                <Text style={styles.paragraph}>
                    Parrots may collect information that users voluntarily provide, including profile
                    details, images, vehicle and voyage information, messages, and contact details.
                    Users choose what information to share.
                </Text>
                <Text style={styles.paragraph}>
                    Parrots does not verify the accuracy of user-provided information.
                </Text>

                <Text style={styles.sectionTitle2}>b. Automatically Collected Data</Text>
                <Text style={styles.paragraph}>
                    Limited technical data may be collected automatically, such as device type, app
                    version, error logs, and IP address, for security and service improvement purposes
                    only.
                </Text>

                <Text style={styles.sectionTitle2}>c. How We Use Data</Text>
                <Text style={styles.paragraph}>
                    Personal data is used solely to operate and maintain the platform, enable user
                    interaction, display content, ensure security, and respond to support requests.
                </Text>
                <Text style={styles.paragraph}>
                    Parrots does not sell user data and does not use personal data for advertising or
                    profiling.
                </Text>

                <Text style={styles.sectionTitle2}>d. Legal Basis</Text>
                <Text style={styles.paragraph}>
                    Data is processed based on user consent, contractual necessity, legitimate
                    interests (such as platform security), and legal obligations under UK GDPR.
                </Text>

                <Text style={styles.sectionTitle2}>e. Data Sharing</Text>
                <Text style={styles.paragraph}>
                    Parrots does not share personal data with third parties for marketing purposes.
                    Information is visible to other users only where users choose to make it public
                    (e.g., profiles, listings, messages).
                </Text>
                <Text style={styles.paragraph}>
                    Parrots uses trusted third-party infrastructure providers to store and serve data,
                    including file storage and hosting services. These providers act as data processors
                    under UK GDPR and are engaged under appropriate data processing terms. They do not
                    have independent access to your data for their own purposes.
                </Text>

                <Text style={styles.sectionTitle2}>f. User Communications</Text>
                <Text style={styles.paragraph}>
                    Messages between users are private. Parrots does not actively monitor, verify, or
                    endorse user communications.
                </Text>

                <Text style={styles.sectionTitle2}>g. Data Retention</Text>
                <Text style={styles.paragraph}>
                    Personal data is retained only as long as necessary to operate the service or
                    comply with legal requirements. Message content may be deleted after a retention
                    period of up to 2 years. Users may request deletion of their account and
                    associated data.
                </Text>

                <Text style={styles.sectionTitle2}>h. User Rights</Text>
                <Text style={styles.paragraph}>
                    Users have the right to access, correct, delete, or restrict processing of their
                    personal data, and to withdraw consent at any time, in accordance with UK GDPR.
                </Text>

                <Text style={styles.sectionTitle2}>i. Children's Privacy</Text>
                <Text style={styles.paragraph}>
                    Parrots is not intended for users under the age of 18 and does not knowingly
                    collect data from minors.
                </Text>

                <Text style={styles.sectionTitle2}>j. Changes to Privacy Policy</Text>
                <Text style={styles.paragraph}>
                    Parrots may update this Privacy Policy from time to time. Continued use of the
                    platform constitutes acceptance of the updated policy.
                </Text>

                <Text style={styles.sectionTitle2}>k. Local Device Storage</Text>
                <Text style={styles.paragraph}>
                    Parrots may store certain information locally on your device,
                    such as login credentials, preferences, and app settings, to maintain your session and improve functionality.
                    This data is not shared with third parties and can be cleared by you at any time.
                </Text>
            </View>

            {/* 14. Dispute Resolution */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>14. Dispute Resolution</Text>
                <Text style={styles.paragraph}>
                    In the event of a dispute, users are encouraged to contact Parrots at
                    parrotsapp@gmail.com in the first instance to seek an informal resolution.
                </Text>
                <Text style={styles.paragraph}>
                    Parrots does not currently participate in any formal Alternative Dispute
                    Resolution (ADR) scheme. Users retain the right to bring claims before a
                    UK court of competent jurisdiction.
                </Text>
            </View>

            {/* 15. Law */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>15. Governing Law</Text>
                <Text style={styles.paragraph}>
                    These Terms are governed by the laws of the United Kingdom.
                </Text>
            </View>

            {/* 16. Contact */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>16. Contact</Text>
                <Text style={styles.paragraph}>
                    Email: parrotsapp@gmail.com{"\n"}
                    Location: United Kingdom
                </Text>
            </View>

            {/* 17. Service Termination */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>17. Service Termination and Discontinuation</Text>
                <Text style={styles.paragraph}>
                    Parrots reserves the right to modify, suspend, or permanently discontinue the Service, or any part thereof, at any time and for any reason, with or without prior notice. We shall not be liable to you or any third party for any such modification, suspension, or discontinuation.
                </Text>
                <Text style={styles.paragraph}>
                    In the event of permanent discontinuation of the Service, we will make reasonable efforts to provide advance notice. Any unused paid credits (such as ParrotCoins) purchased prior to the discontinuation date will be eligible for a refund, subject to the refund process described in our Refund Policy. We shall have no further obligation beyond such refund.
                </Text>
                <Text style={styles.paragraph}>
                    Upon termination or discontinuation, we will retain your data for a period of 30 days, during which you may request a copy of your personal data. After this period, your data may be permanently deleted in accordance with our Privacy Policy.
                </Text>
            </View>

            {/* 18. Refund Policy */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>18. Refund Policy</Text>

                <Text style={styles.sectionTitle2}>ParrotCoins and Paid Credits</Text>
                <Text style={styles.paragraph}>
                    ParrotCoins are virtual credits within the Parrots application used to access premium features, such as displaying voyages on the public map.
                </Text>

                <Text style={styles.sectionTitle2}>Current Status of ParrotCoins</Text>
                <Text style={styles.paragraph}>
                    ParrotCoins are currently provided free of charge until further notice. No purchase is required at this time. Should operational or infrastructure costs require a transition to a paid model, users will be notified in advance. The refund terms below apply once ParrotCoins become a paid feature.
                </Text>

                <Text style={styles.sectionTitle2}>General Policy</Text>
                <Text style={styles.paragraph}>
                    Once ParrotCoins become a paid feature, all purchases will be denominated in Euro (EUR) and made through the applicable app store platform (Apple App Store or Google Play Store). All purchases of ParrotCoins will be final and non-refundable, except in the following circumstances:{"\n"}
                    {"  "}• A technical error caused by Parrots resulted in credits not being applied to your account after a successful payment.{"\n"}
                    {"  "}• The Service is permanently discontinued, in which case unused ParrotCoins will be refunded as described above.{"\n"}
                    {"  "}• Applicable consumer protection law in your jurisdiction grants you a statutory right to a refund that cannot be waived by this policy.
                </Text>

                <Text style={styles.sectionTitle2}>Platform Purchases</Text>
                <Text style={styles.paragraph}>
                    If you purchase ParrotCoins through the Apple App Store or Google Play Store, refund requests must be submitted directly to Apple or Google in accordance with their respective refund policies. Parrots has no control over and cannot process refunds for purchases made through these platforms.
                </Text>

                <Text style={styles.sectionTitle2}>How to Request a Refund</Text>
                <Text style={styles.paragraph}>
                    To request a refund for an eligible purchase, contact us at parrotsapp@gmail.com within 14 days of the purchase date. Please include your registered email address, the date of purchase, and a description of the issue. We will respond within 5 business days.
                </Text>

                <Text style={styles.sectionTitle2}>Unused Credits on Service Discontinuation</Text>
                <Text style={styles.paragraph}>
                    In the event that Parrots permanently discontinues the Service, users with a remaining ParrotCoin balance will be contacted at the email address associated with their account with instructions for claiming a refund. Refund claims must be submitted within 60 days of the discontinuation notice.
                </Text>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 16,
    },
    titleMain: {
        fontSize: 22,
        fontFamily: "Nunito_800ExtraBold",
        color: parrotTextDarkBlue,
        textAlign: "center",
        marginVertical: 20,
    },
    wrapper: {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionContainer: {
        marginTop: 8,
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
    paragraph: {
        fontSize: 14,
        fontFamily: "Nunito_700Bold",
        color: parrotTextDarkBlue,
        lineHeight: 20,
        marginBottom: 6,
    },
});
