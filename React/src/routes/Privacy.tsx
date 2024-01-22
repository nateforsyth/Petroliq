import * as React from "react";
import IPrivacyProps from "./IPrivacyProps";
import IPrivacyItem from "../components/model/interfaces/IPrivacyItem";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const Privacy: React.FunctionComponent<IPrivacyProps> = (props) => {
    const privacyData = (): IPrivacyItem[] => {
        let data: IPrivacyItem[] = [
            {
                category: "A. Identifiers",
                examples: "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name",
                collected: "NO"
            },
            {
                category: "B. Personal information as defined in the California Customer Records statute",
                examples: "Name, contact information, education, employment, employment history, and financial information",
                collected: "NO"
            },
            {
                category: "C . Protected classification characteristics under state or federal law",
                examples: "Gender and date of birth",
                collected: "NO"
            },
            {
                category: "D . Commercial information",
                examples: "Transaction information, purchase history, financial details, and payment information",
                collected: "NO"
            },
            {
                category: "E . Biometric information",
                examples: "Fingerprints and voiceprints",
                collected: "NO"
            },
            {
                category: "F . Internet or other similar network activity",
                examples: "Browsing history, search history, online behaviour , interest data, and interactions with our and other websites, applications, systems, and advertisements",
                collected: "NO"
            },
            {
                category: "G . Geolocation data",
                examples: "Device location",
                collected: "NO"
            },
            {
                category: "H . Audio, electronic, visual, thermal, olfactory, or similar information",
                examples: "Images and audio, video or call recordings created in connection with our business activities",
                collected: "NO"
            },
            {
                category: "I . Professional or employment-related information",
                examples: "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us",
                collected: "NO"
            },
            {
                category: "J . Education Information",
                examples: "Student records and directory information",
                collected: "NO"
            },
            {
                category: "K . Inferences drawn from collected personal information",
                examples: "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics",
                collected: "NO"
            },
            {
                category: "L . Sensitive personal Information",
                examples: "",
                collected: "NO"
            },
        ];

        return data;
    };

    const collectionContainer = (): JSX.Element => {
        return (<TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="left">Examples</TableCell>
                        <TableCell align="right">Collected?</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {privacyData().map((row) => (
                        <TableRow
                            key={row.category}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.category}
                            </TableCell>
                            <TableCell align="right">{row.examples}</TableCell>
                            <TableCell align="right">{row.collected}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>)
    };

    let htmlElement: JSX.Element =
        <main className={`subheadingElement`}>
            <div>
                <h3>Last updated January 21, 2024</h3>
                <p>This privacy notice for <a href="https://dreamsof.dev">dreamsof.dev</a> ('we', 'us', or 'our' ), describes how and why we might collect, store, use, and/or share ( 'process') your information when you use our services ( 'Services'), such as when you:</p>
                <p>Visit our website at https://dreamsof.dev , or any website of ours that links to this privacy notice</p>
                <p>Download and use our mobile application ( PetrolIQ) , or any other application of ours that links to this privacy notice</p>
                <p>Engage with us in other related ways, including any sales, marketing, or events</p>
                <p>Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a>.</p>
                <h3>SUMMARY OF KEY POINTS</h3>
                <p><b><i>This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our <a href="#tableofcontents">table of contents</a> below to find the section you are looking for.</i></b></p>
                <p><b>What personal information do we process?</b> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about personal information you disclose to us.</p>
                <p><b>Do we process any sensitive personal information?</b> We do not process sensitive personal information.</p>
                <p><b>Do we receive any information from third parties?</b> We do not receive any information from third parties.</p>
                <p><b>How do we process your information?</b> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about how we process your information.</p>
                <p><b>In what situations and with which parties do we share personal information?</b> We may share information in specific situations and with specific third parties. Learn more about when and with whom we share your personal information.</p>
                <p><b>How do we keep your information safe?</b> We have organisational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about how we keep your information safe.</p>
                <p><b>What are your rights?</b> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about your privacy rights.</p>
                <p><b>How do you exercise your rights?</b> The easiest way to exercise your rights is by visiting <a href="https://app.dreamsof.dev/Profile" target="_blank" rel="noreferrer">your Profile page</a>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</p>
                <p>Want to learn more about what we do with any information we collect? <a href="#tableofcontents">Review the privacy notice in full</a>.</p>
                <h3 id="tableofcontents">TABLE OF CONTENTS</h3>
                <ul>
                    <li><a href="#1">1. WHAT INFORMATION DO WE COLLECT?</a></li>
                    <li><a href="#2">2. HOW DO WE PROCESS YOUR INFORMATION?</a></li>
                    <li><a href="#3">3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</a></li>
                    <li><a href="#4">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
                    <li><a href="#5">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></li>
                    <li><a href="#6">6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></li>
                    <li><a href="#7">7. HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
                    <li><a href="#8">8. HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
                    <li><a href="#9">9. DO WE COLLECT INFORMATION FROM MINORS?</a></li>
                    <li><a href="#10">10. WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
                    <li><a href="#11">11. CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
                    <li><a href="#12">12. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</a></li>
                    <li><a href="#13">13. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</a></li>
                    <li><a href="#14">14. DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
                    <li><a href="#15">15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
                    <li><a href="#16">16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
                </ul>
                <h3 id="1">1. WHAT INFORMATION DO WE COLLECT?</h3>
                <h4>Personal information you disclose to us</h4>
                <p><b>In Short: </b>We collect personal information that you provide to us.</p>
                <p>We collect personal information that you voluntarily provide to us when you register on the Services,  express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
                <p><b>Personal Information Provided by You.</b> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
                <ul>
                    <li>names</li>
                    <li>email addresses</li>
                    <li>usernames</li>
                    <li>passwords</li>
                </ul>
                <p><b>Sensitive Information.</b> We do not process sensitive information.</p>
                <p><b>Social Media Login Data.</b> We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called <a href="#6">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a> below.</p>
                <p>Application Data. If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:</p>
                <ul>
                    <li><i>Geolocation Information.</i> We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application(s), to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device's settings.</li>
                    <li><i>Mobile Device Data.</i> We automatically collect device information (such as your mobile device ID, model, and manufacturer), operating system, version information and system configuration information, device and application identification numbers, browser type and version, hardware model Internet service provider and/or mobile carrier, and Internet Protocol (IP) address (or proxy server). If you are using our application(s), we may also collect information about the phone network associated with your mobile device, your mobile device's operating system or platform, the type of mobile device you use, your mobile device's unique device ID, and information about the features of our application(s) you accessed.</li>
                    <li><i>Push Notifications.</i> We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings.</li>
                </ul>
                <p>This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.</p>
                <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>
                <h4>Information automatically collected</h4>
                <p><b>In Short: </b>Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</p>
                <p>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
                <p>Like many businesses, we also collect information through cookies and similar technologies.</p>
                <p>The information we collect includes:</p>
                <ul>
                    <li><i>Log and Usage Data.</i> Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called 'crash dumps'), and hardware settings).</li>
                    <li><i>Device Data.</i> We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.</li>
                    <li><i>Location Data.</i> We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.</li>
                </ul>
                <h3 id="2">2. HOW DO WE PROCESS YOUR INFORMATION?</h3>
                <p><b>In Short: </b>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
                <h4>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</h4>
                <li><b>To facilitate account creation and authentication and otherwise manage user accounts.</b> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
                <li><b>To request feedback.</b> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
                <li><b>To protect our Services.</b> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</li>
                <li><b>To identify usage trends.</b> We may process information about how you use our Services to better understand how they are being used so we can improve them.</li>
                <li><b>To save or protect an individual's vital interest.</b> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
                <h3 id="3">3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?</h3>
                <p><b>In Short: </b>We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e. legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfil our contractual obligations, to protect your rights, or to fulfil our legitimate business interests.</p>
                <h4>If you are located in the EU or UK, this section applies to you.</h4>
                <p>The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:</p>
                <li><b>Consent.</b> We may process your information if you have given us permission (i.e. consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about <a href="#withdraw">withdrawing your consent</a>.</li>
                <li><b>Legitimate Interests.</b> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:</li>
                <ul>
                    <li>Analyse how our Services are used so we can improve them to engage and retain users</li>
                    <li>Diagnose problems and/or prevent fraudulent activities</li>
                    <li>Understand how our users use our products and services so we can improve user experience</li>
                </ul>
                <li><b>Legal Obligations.</b> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
                <li><b>Vital Interests.</b> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</li>
                <h4>If you are located in Canada, this section applies to you.</h4>
                <p>We may process your information if you have given us specific permission (i.e. express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e. implied consent). <a href="#withdraw">You can withdraw your consent at any time</a>.</p>
                <p>In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</p>
                <ul>
                    <li>If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
                    <li>For investigations and fraud detection and prevention</li>
                    <li>For business transactions provided certain conditions are met</li>
                    <li>If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</li>
                    <li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
                    <li>If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
                    <li>If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</li>
                    <li>If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</li>
                    <li>If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</li>
                    <li>If the collection is solely for journalistic, artistic, or literary purposes</li>
                    <li>If the information is publicly available and is specified by the regulations</li>
                </ul>
                <h3 id="4">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h3>
                <p><b>In Short: </b>We may share information in specific situations described in this section and/or with the following third parties.</p>
                <p>We may need to share your personal information in the following situations:</p>
                <ul>
                    <li><b>Business Transfers.</b> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                    <li><b>When we use Google Maps Platform APIs.</b> We may share your information with certain Google Maps Platform APIs (e.g. Google Maps API, Places API).</li>
                </ul>
                <h3 id="5">5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h3>
                <p><b>In Short: </b>We may use cookies and other tracking technologies to collect and store your information.</p>
                <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice .</p>
                <h3 id="6">6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h3>
                <p><b>In Short: </b>If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</p>
                <p>Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.</p>
                <p>We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.</p>
                <h3 id="6">7. HOW LONG DO WE KEEP YOUR INFORMATION?</h3>
                <p><b>In Short: </b>We keep your information for as long as necessary to fulfil the purposes outlined in this privacy notice unless otherwise required by law.</p>
                <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than   the period of time in which users have an account with us .</p>
                <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
                <h3 id="8">8. HOW DO WE KEEP YOUR INFORMATION SAFE?</h3>
                <p><b>In Short: </b>We aim to protect your personal information through a system of organisational and technical security measures.</p>
                <p>We have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</p>
                <h3 id="9">9. DO WE COLLECT INFORMATION FROM MINORS?</h3>
                <p><b>In Short: </b>We do not knowingly collect data from or market to children under 18 years of age .</p>
                <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> .</p>
                <h3 id="10">10. WHAT ARE YOUR PRIVACY RIGHTS?</h3>
                <p><b>In Short: </b> In some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada , you have rights that allow you greater access to and control over your personal information.  You may review, change, or terminate your account at any time.</p>
                <p>In some regions (like the EEA, UK, Switzerland, and Canada ), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section <a href="#15">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a> below.</p>
                <p>We will consider and act upon any request in accordance with applicable data protection laws.</p>
                <p>If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your <a href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm" target="_blank" rel="noreferrer">Member State data protection authority</a> or <a href="https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/" target="_blank" rel="noreferrer">UK data protection authority</a>.</p>
                <p>If you are located in Switzerland, you may contact the <a href="https://www.edoeb.admin.ch/edoeb/en/home.html" target="_blank" rel="noreferrer">Federal Data Protection and Information Commissioner</a>.</p>
                <p><b id="withdraw"><u>Withdrawing your consent:</u></b> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section <a href="#15">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a> below or updating your preferences .</p>
                <p>However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.</p>
                <h4>Account Information</h4>
                <p>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
                <ul>
                    <li>Log in to your account settings and update your user account.</li>
                </ul>
                <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</p>
                <p><b><u>Cookies and similar technologies:</u></b> Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.</p>
                <p>If you have questions or comments about your privacy rights, you may email us at <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> .</p>
                <h3 id="11">11. CONTROLS FOR DO-NOT-TRACK FEATURES</h3>
                <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ( 'DNT' ) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognising and implementing DNT signals has been finalised . As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.</p>
                <h3 id="12">12. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
                <p><b>In Short: </b>If you are a resident of California , Colorado , Connecticut , Utah or Virginia , you are granted specific rights regarding access to your personal information.</p>
                <h4>What categories of personal information do we collect?</h4>
                <p>We have collected the following categories of personal information in the past twelve (12) months:</p>
                {
                    collectionContainer()
                }
                <p>We will use and retain the collected personal information as needed to provide the Services or for:</p>
                <ul>
                    <li>Category B - As long as the user has an account with us</li>
                </ul>
                <p>We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</p>
                <ul>
                    <li>Receiving help through our customer support channels;</li>
                    <li>Participation in customer surveys or contests; and</li>
                    <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
                </ul>
                <h4>How do we use and share your personal information?</h4>
                <p>Learn about how we use your personal information in the section, <a href="#2">HOW DO WE PROCESS YOUR INFORMATION?</a></p>
                <h4>Will your information be shared with anyone else?</h4>
                <p>We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, <a href="#4">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></p>
                <p>We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be 'selling' of your personal information.</p>
                <p>We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.</p>
                <h4>California Residents</h4>
                <p>California Civil Code Section 1798.83, also known as the 'Shine The Light' law permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.</p>
                <p>If you are under 18 years of age, reside in California, and have a registered account with the Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g. backups, etc.).</p>
                <h5>CCPA Privacy Notice</h5>
                <p>This section applies only to California residents. Under the California Consumer Privacy Act (CCPA), you have the rights listed below.</p>
                <p>The California Code of Regulations defines a 'residents' as:</p>
                <li>(1) every individual who is in the State of California for other than a temporary or transitory purpose and</li>
                <li>(2) every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose</li>
                <p>All other individuals are defined as 'non-residents'.</p>
                <p>If this definition of 'resident' applies to you, we must adhere to certain rights and obligations regarding your personal information.</p>
                <h5>Your rights with respect to your personal data</h5>
                <h6>Right to request deletion of the data — Request to delete</h6>
                <li>You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.</li>
                <h6>Right to be informed — Request to know</h6>
                <ul>
                    <li>Depending on the circumstances, you have a right to know:</li>
                    <li>whether we collect and use your personal information;</li>
                    <li>the categories of personal information that we collect;</li>
                    <li>the purposes for which the collected personal information is used;</li>
                    <li>whether we sell or share personal information to third parties;</li>
                    <li>the categories of personal information that we sold, shared, or disclosed for a business purpose;</li>
                    <li>the categories of third parties to whom the personal information was sold, shared, or disclosed for a business purpose;</li>
                    <li>the business or commercial purpose for collecting, selling, or sharing personal information; and</li>
                    <li>the specific pieces of personal information we collected about you.</li>
                </ul>
                <p>In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.</p>
                <h6>Right to Non-Discrimination for the Exercise of a Consumer's Privacy Rights</h6>
                <p>We will not discriminate against you if you exercise your privacy rights.</p>
                <h6>Right to Limit Use and Disclosure of Sensitive Personal Information</h6>
                <p>We do not process consumer's sensitive personal information.</p>
                <h6>Verification process</h6>
                <p>Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g. phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.</p>
                <p>We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.</p>
                <h6>Other privacy rights</h6>
                <p>You may object to the processing of your personal information.</p>
                <p>You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information.</p>
                <p>You can designate an authorised agent to make a request under the CCPA on your behalf. We may deny a request from an authorised agent that does not submit proof that they have been validly authorised to act on your behalf in accordance with the CCPA.</p>
                <p>You may request to opt out from future selling or sharing of your personal information to third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen (15) days from the date of the request submission.</p>
                <p>To exercise these rights, you can contact us by visiting <a href="https://app.dreamsof.dev/Profile" target="_blank" rel="noreferrer">your Profile page</a>, by visiting <a href="https://app.dreamsof.dev/Contact" target="_blank" rel="noreferrer">your Contact page</a>, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.</p>
                <h4>Colorado Residents</h4>
                <p>This section applies only to Colorado residents. Under the Colorado Privacy Act (CPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.</p>
                <ul>
                    <li>Right to be informed whether or not we are processing your personal data</li>
                    <li>Right to access your personal data</li>
                    <li>Right to correct inaccuracies in your personal data</li>
                    <li>Right to request deletion of your personal data</li>
                    <li>Right to obtain a copy of the personal data you previously shared with us</li>
                    <li>Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ( 'profiling' )</li>
                </ul>
                <p>To submit a request to exercise these rights described above, please email <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> or visit <a href="https://app.dreamsof.dev/Profile" target="_blank" rel="noreferrer">your Profile page</a>.</p>
                <p>If we decline to take action regarding your request and you wish to appeal our decision, please email us at <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> . Within forty-five (45) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.</p>
                <h4>Connecticut Residents</h4>
                <p>This section applies only to Connecticut residents. Under the Connecticut Data Privacy Act (CTDPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.</p>
                <ul>
                    <li>Right to be informed whether or not we are processing your personal data</li>
                    <li>Right to access your personal data</li>
                    <li>Right to correct inaccuracies in your personal data</li>
                    <li>Right to request deletion of your personal data</li>
                    <li>Right to obtain a copy of the personal data you previously shared with us</li>
                    <li>Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ( 'profiling' )</li>
                </ul>
                <p>To submit a request to exercise these rights described above, please email <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> or visit <a href="https://app.dreamsof.dev/Profile" target="_blank" rel="noreferrer">your Profile page</a>.</p>
                <p>If we decline to take action regarding your request and you wish to appeal our decision, please email us at <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> . Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions.</p>
                <h4>Utah Residents</h4>
                <p>This section applies only to Utah residents. Under the Utah Consumer Privacy Act (UCPA), you have the rights listed below. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law.</p>
                <ul>
                    <li>Right to be informed whether or not we are processing your personal data</li>
                    <li>Right to access your personal data</li>
                    <li>Right to request deletion of your personal data</li>
                    <li>Right to obtain a copy of the personal data you previously shared with us</li>
                    <li>Right to opt out of the processing of your personal data if it is used for targeted advertising or the sale of personal data</li>
                </ul>
                <p>To submit a request to exercise these rights described above, please email <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> or visit <a href="https://app.dreamsof.dev/Profile" target="_blank" rel="noreferrer">your Profile page</a>.</p>
                <h4>Virginia Residents</h4>
                <p>Under the Virginia Consumer Data Protection Act (VCDPA):</p>
                <li>'Consumer' means a natural person who is a resident of the Commonwealth acting only in an individual or household context. It does not include a natural person acting in a commercial or employment context.</li>
                <li>'Personal data' means any information that is linked or reasonably linkable to an identified or identifiable natural person. 'Personal data' does not include de-identified data or publicly available information.</li>
                <li>'Sale of personal data' means the exchange of personal data for monetary consideration.</li>
                <p>If this definition of 'consumer' applies to you, we must adhere to certain rights and obligations regarding your personal data.</p>
                <h5>Your rights with respect to your personal data</h5>
                <ul>
                    <li>Right to be informed whether or not we are processing your personal data</li>
                    <li>Right to access your personal data</li>
                    <li>Right to correct inaccuracies in your personal data</li>
                    <li>Right to request deletion of your personal data</li>
                    <li>Right to obtain a copy of the personal data you previously shared with us</li>
                    <li>Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ( 'profiling' )</li>
                </ul>
                <p>Exercise your rights provided under the Virginia VCDPA</p>
                <p>To submit a request to exercise these rights described above, please email <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> or visit <a href="https://app.dreamsof.dev/Profile" target="_blank" rel="noreferrer">your Profile page</a>.</p>
                <p>If you are using an authorised agent to exercise your rights, we may deny a request if the authorised agent does not submit proof that they have been validly authorised to act on your behalf.</p>
                <h5>Verification process</h5>
                <p>We may request that you provide additional information reasonably necessary to verify you and your consumer's request. If you submit the request through an authorised agent, we may need to collect additional information to verify your identity before processing your request.</p>
                <p>Upon receiving your request, we will respond without undue delay, but in all cases, within forty-five (45) days of receipt. The response period may be extended once by forty-five (45) additional days when reasonably necessary. We will inform you of any such extension within the initial 45-day response period, together with the reason for the extension.</p>
                <h5>Right to appeal</h5>
                <p>If we decline to take action regarding your request, we will inform you of our decision and reasoning behind it. If you wish to appeal our decision, please email us at <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a> . Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may contact the <a href="https://www.oag.state.va.us/consumer-protection/index.php/file-a-complaint" target="_blank" rel="noreferrer">Attorney General</a> to submit a complaint.</p>
                <h3 id="13">13. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</h3>
                <p><b>In Short: </b>You may have additional rights based on the country you reside in.</p>
                <h4>Australia and New Zealand</h4>
                <p>We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020 (Privacy Act).</p>
                <p>This privacy notice satisfies the notice requirements defined in both Privacy Acts , in particular: what personal information we collect from you, from which sources, for which purposes, and other recipients of your personal information.</p>
                <p>If you do not wish to provide the personal information necessary to fulfill their applicable purpose, it may affect our ability to provide our services, in particular:</p>
                <ul>
                    <li>offer you the products or services that you want</li>
                    <li>respond to or help with your requests</li>
                    <li>manage your account with us</li>
                    <li>confirm your identity and protect your account</li>
                </ul>
                <p>At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section <a href="#16">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></p>
                <p>If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the <a href="https://www.oaic.gov.au/privacy/privacy-complaints/lodge-a-privacy-complaint-with-us" target="_blank" rel="noreferrer">Office of the Australian Information Commissioner</a> and a breach of New Zealand's Privacy Principles to the <a href="https://www.privacy.org.nz/your-rights/making-a-complaint/" target="_blank" rel="noreferrer">Office of New Zealand Privacy Commissioner</a>.</p>
                <h3 id="14">14. DO WE MAKE UPDATES TO THIS NOTICE?</h3>
                <p><b>In Short: </b>Yes, we will update this notice as necessary to stay compliant with relevant laws.</p>
                <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated 'Revised' date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
                <h3 id="15">15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h3>
                <p>If you have questions or comments about this notice, you may email us at <a href="mailto:info@dreamsof.dev">info@dreamsof.dev</a>.</p>
                <h3 id="16">16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h3>
                <p>You have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please visit: <a href="https://app.dreamsof.dev/Profile" target="_blank" rel="noreferrer">your Profile page</a>.</p>

            </div >
        </main >;

    return htmlElement;
}

export default Privacy;
