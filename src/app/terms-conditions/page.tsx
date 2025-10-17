
"use client";

import React from 'react';
import Header from '@/components/blog/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function TermsConditionsPage() {
    const [user, setUser] = React.useState<User | null>(null);
    const auth = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!auth) return;
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribeAuth();
    }, [auth]);

    const handleLogout = () => {
        if (auth) {
            signOut(auth).then(() => {
                router.push('/');
            });
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header user={user} onLogout={handleLogout} />
            <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Terms & Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-muted-foreground prose dark:prose-invert max-w-none">
                        
                        <h2 className="text-xl font-semibold text-foreground">1. Use of this site</h2>
                        <p>Your use of blogify.blog is expressly conditional upon your acceptance of the following terms and conditions. By using this site you signify your consent to be bound by these terms and conditions. If you do not agree with any part of the following terms and conditions you must not use the Blogify.blog Site.</p>

                        <h2 className="text-xl font-semibold text-foreground">2. Definitions</h2>
                        <p>“You” means you, the user of the Blogify.blog Site and “Your” shall be interpreted accordingly. “We/Us” means Blogify.blog and “Our” shall be interpreted accordingly. “Blogify.blog Site” shall have the meaning as set out above. “User Information” means the personal details which may be provided by You to Us via the Blogify.blog Site. “Users” means the users of the Blogify.blog Site collectively and/or individually as the context admits. “Website” means a site on the World Wide Web.</p>

                        <h2 className="text-xl font-semibold text-foreground">3. Acceptable Use</h2>
                        <p>You agree that any use by You of the Blogify.blog Site shall be in accordance with the following conditions:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>You will not post or transmit through the Blogify.blog Site any defamatory, threatening, obscene, harmful, pornographic or otherwise illegal material or material which would violate or infringe in any way upon our rights or those of others (including intellectual property rights, rights of confidentiality, or rights of privacy) or cause distress or inconvenience. You must not express opinions that are vulgar, crude, sexist, racist , discriminatory, or otherwise offensive or in breach of an laws. Always treat other Users with respect.</li>
                            <li>You will not post or otherwise make available on the Blogify.blog Site any material which You do not own without the express prior written permission of the owner of the material.</li>
                            <li>You will not copy, download, reproduce, republish, frame, broadcast, transmit in any manner whatsoever, or make available any material on the Blogify.blog Site except as is strictly necessary for Your own personal non-commercial home use.</li>
                            <li>You will abide by the specific rules of any competition or promotion that You participate in on or via the Blogify.blog site.</li>
                            <li>You will not do anything that affects the operability or security of the Blogify.blog Site or causes unreasonable inconvenience or offence or disruption to our staff or users.</li>
                            <li>Blogify.blog reserves the right to alter, edit, modify, remove or shut down all or part of the Blogify.blog Website or its contents without further notice.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground">4. Third Party Websites</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>The Site contains links to third party Web Sites, including those provided by advertisers and commercial sponsors. These links are provided solely as a convenience to you and not as an endorsement by Blogify.blog of the contents of, or goods or services provided by such third party Web Sites. Blogify.blog is not responsible for the content of linked third party sites and does not make any representations regarding the content or accuracy of information contained on such third party Web Sites. If you decide to access linked third-party Web Sites, you do so at your own risk.</li>
                            <li>Blogify.blog generally welcomes the hyper-linking to the Blogify.blog Site from other appropriate Web Sites provided such links are to the Sites homepage (and no deeper within the Site) and provided Blogify.blog gives its consent to the establishment of such links. Notwithstanding the foregoing, Blogify.blog reserves the absolute right to refuse to consent to such links without giving reasons. Any links to the Blogify.blog Site from another Web Site must be presented in such a manner that the viewing of the Blogify.blog Site is not impaired by framing or similar techniques that may impair the visitor’s user experience.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>All copyright, trade marks and all other intellectual property rights in all material or content supplied as part of the Blogify.blog Site shall remain at all times vested in Us or Our licensors. You are not permitted to use this material or content unless expressly authorised in writing by Us or Our licensors. You will not, and You will not assist or facilitate any third party to, copy, reproduce, transmit, distribute, frame, make available, commercially exploit or create derivative works of such material or content.</li>
                            <li>If You become aware of any such distribution or commercial exploitation, You agree to notify Us immediately.</li>
                            <li>You acknowledge that by posting or sending material or content to the Blogify.blog Site You grant to Us and Our licensors and assigns an irrevocable, perpetual, royalty free, worldwide licence to use the materials both within the Blogify.blog Site and in any other manner. The licence extends to copying, distributing, broadcasting, and otherwise transmitting, and adapting and editing the materials.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground">6. Liability for and information provided on the Blogify.blog Site</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Material which is posted on any bulletin boards is written by Users and We are not responsible for and do not endorse such material. We reserve the right to monitor the contributions made and may respond to or comment upon communications made by You and edit, refuse to post, or remove any content from the bulletin boards in our absolute discretion. No failure to remove particular material constitutes an endorsement or acceptance of it by Us.</li>
                            <li>We will not be held responsible or liable for the content, accuracy, timing or reliability of any information or statements contained within the Blogify.blog Site, or for statements, advice and/or opinions made or given by Users on the bulletin boards . If You have any claim arising from the actions or statements of another User, You agree to pursue such a claim only against that User and not against Us.</li>
                            <li>We will endeavour to provide the Blogify.blog Site using all reasonable care. On occasions our site may publish articles or features, which some site visitors may find offensive. Blogify.blog does not intend to offend and suggests that site visitors who find the tone or content of the site offensive, no longer visit the site. No responsibility is taken for any offense caused. To the maximum extent permissible by law, Blogify.blog disclaims all warranties in relation to the content of the Blogify.blog Site and makes no representation or warranty in respect of the Blogify.blog Site or the material contained therein or its quality, accuracy or fitness for purpose. Further, Blogify.blog makes no representations that the material contained in the Blogify.blog Site, or any of the functions contained in the Blogify.blog Site or its server will operate without interruption or delay or will be error free, free of viruses or bugs or is compatible with any other software or material.</li>
                            <li>We will be liable for any fraudulent misrepresentations We make and for any death or personal injury caused by Our negligence. We will not be responsible or liable to You for any other loss or damage that You or any third party may suffer as a result of using or in connection with Your use of the Blogify.blog Site.</li>
                            <li>Blogify.blog disclaims liability in connection with Your use or misuse of the Blogify.blog Site to the maximum extent permissible by law.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground">7. Competitions</h2>
                        <p>Unless otherwise stated the promoter of competitions on the site is Blogify.blog. Entrants must be over 18 and resident in Pakistan. Employees/families/agents of the promoter and its associates are not eligible. One entry per person/per household. No purchase is necessary. Details of the winner can be requested. Prize is subject to availability/may be substituted. Please allow a period of 30 days for prize to be delivered (if applicable) upon winning the competition. No cash alternative/prize is non-refundable/non-transferable. The promoter accepts no liability for lost/damaged/incomplete entries. Proof of entry is not proof of delivery. The winner may need to sign a statement of eligibility/liability/publicity release. Third party T&Cs may apply. Details of entries will be kept on a database and may be used and passed to third parties to enable the processing of Completion/prize fulfillment/ where entrant has consented to share this information with other companies for marketing. To the extent as permitted by Pakistan law, the promoter excludes all liability for any loss in connection with the competition.</p>

                        <h2 className="text-xl font-semibold text-foreground">8. Privacy</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>We shall comply with all applicable data protection legislation from time to time in place in respect of any personal information relating to You gathered by Us.</li>
                            <li>You may be asked to input information about yourself on different pages of the Blogify.blog Site. We will not use the information You provide to Us for any purpose other than as stated at each location where such information is requested.</li>
                            <li>Please email <a href="mailto:sherazhussainofficial1@gmail.com">sherazhussainofficial1@gmail.com</a> to notify Us of any changes to the information You have previously given or if You wish to withdraw Your consent to Our using Your User Information for the stated purposes or for any form of promotional contact.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-foreground">9. Indemnity</h2>
                        <p>You agree to indemnify Us, and/or any of Our affiliates and including their officers, directors and employees, servants and agents immediately on demand, against all claims, liability, damages, costs and expenses, including legal fees, arising out of any breach of these terms and conditions by You, and (if applicable) your officers, directors and employees, servants and agents and against any other liabilities arising out of Your use of the Blogify.blog Site.</p>

                        <h2 className="text-xl font-semibold text-foreground">10. Termination</h2>
                        <p>We reserve the right immediately to terminate Your use of the Blogify.blog Site in circumstance including (but not limited to) where You or (if applicable) your officers, directors and employees, servants and agents breach or procure a breach these terms and conditions or otherwise engage in conduct which We determine in Our sole discretion to be unacceptable or harmful to Blogify.blog or its users.</p>

                        <h2 className="text-xl font-semibold text-foreground">11. Feedback</h2>
                        <p>Should You wish to make any comments to Us about the Blogify.blog website or if you have any questions relating to the same please contact us at <a href="mailto:sherazhussainofficial1@gmail.com">sherazhussainofficial1@gmail.com</a>.</p>
                        
                        <h2 className="text-xl font-semibold text-foreground">12. General</h2>
                         <ul className="list-disc list-inside space-y-2">
                           <li>If any court or regulator decides that any provision of these terms and conditions is invalid or otherwise unenforceable, such provisions shall be severed and deleted from these terms and conditions and the remainder of these terms and conditions shall continue to have full force and effect.</li>
                           <li>We reserve the right to change the terms and conditions upon the posting of any altered terms and conditions upon the “Blogify.blog Site”.</li>
                           <li>The above terms and conditions and the Blogify.blog site are governed by the laws of Pakistan.</li>
                        </ul>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
