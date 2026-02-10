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

            {/* 4. Voyages */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>4. Voyages and Bids</Text>
                <Text style={styles.paragraph}>
                    Parrots does not guarantee any voyage will occur, be safe, or as
                    described. Participation is at users’ own risk.
                </Text>
            </View>

            {/* 5. Communication */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>5. Communication Between Users</Text>
                <Text style={styles.paragraph}>
                    Messages may be false, misleading, or inappropriate. Parrots does not
                    monitor or endorse user communications.
                </Text>
            </View>

            {/* 6. Prohibited */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>6. Prohibited Activities</Text>
                <Text style={styles.paragraph}>
                    Users must not post illegal, harmful, or offensive content; harass or
                    threaten others; or violate intellectual property rights.
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


            {/* 7. IP */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
                <Text style={styles.paragraph}>
                    Users retain ownership of content they post but grant Parrots a
                    non-exclusive, royalty-free license to display it.
                </Text>
            </View>

            {/* 8. Liability */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
                <Text style={styles.paragraph}>
                    Parrots is not liable for any losses, damages, or injuries arising from
                    platform use.
                </Text>
            </View>

            {/* 9. Disclaimers */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>9. Disclaimers</Text>
                <Text style={styles.paragraph}>
                    The platform is provided “as is” without warranties.
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


            {/* 10. Modifications */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>10. Modifications</Text>
                <Text style={styles.paragraph}>
                    Parrots may update these Terms at any time. Continued use constitutes acceptance.
                </Text>
            </View>

            {/* 11. Privacy Policy */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>11. Privacy Policy</Text>

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

                <Text style={styles.sectionTitle2}>f. User Communications</Text>
                <Text style={styles.paragraph}>
                    Messages between users are private. Parrots does not actively monitor, verify, or
                    endorse user communications.
                </Text>

                <Text style={styles.sectionTitle2}>g. Data Retention</Text>
                <Text style={styles.paragraph}>
                    Personal data is retained only as long as necessary to operate the service or
                    comply with legal requirements. Users may request deletion of their account and
                    associated data.
                </Text>

                <Text style={styles.sectionTitle2}>h. User Rights</Text>
                <Text style={styles.paragraph}>
                    Users have the right to access, correct, delete, or restrict processing of their
                    personal data, and to withdraw consent at any time, in accordance with UK GDPR.
                </Text>

                <Text style={styles.sectionTitle2}>i. Children’s Privacy</Text>
                <Text style={styles.paragraph}>
                    Parrots is not intended for users under the age of 18 and does not knowingly
                    collect data from minors.
                </Text>

                <Text style={styles.sectionTitle2}>j. Changes to Privacy Policy</Text>
                <Text style={styles.paragraph}>
                    Parrots may update this Privacy Policy from time to time. Continued use of the
                    platform constitutes acceptance of the updated policy.
                </Text>
            </View>




            {/* 12. Law */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>12. Governing Law</Text>
                <Text style={styles.paragraph}>
                    These Terms are governed by the laws of the United Kingdom.
                </Text>
            </View>

            {/* 13. Contact */}
            <View style={styles.wrapper}>
                <Text style={styles.sectionTitle}>13. Contact</Text>
                <Text style={styles.paragraph}>
                    Email: parrotsapp@gmail.com{"\n"}
                    Location: United Kingdom
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
        fontWeight: "700",
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
        fontWeight: "600",
        color: parrotTextDarkBlue,
        marginBottom: 8,
    },
    sectionTitle2: {
        fontSize: 15,
        fontWeight: "600",
        color: parrotTextDarkBlue,
        marginTop: 12,
        marginBottom: 4,
    },
    paragraph: {
        fontSize: 14,
        color: parrotTextDarkBlue,
        lineHeight: 20,
        marginBottom: 6,
    },
});
