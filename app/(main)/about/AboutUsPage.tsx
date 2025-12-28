import React from 'react';
import { Card } from 'primereact/card';

const AboutUsPage = () => {
    return (
        <>
            <Card>
                <div className="text-gray-800 dark:text-white">
                    <h1 className="text-3xl font-bold mb-4">About the Human Rights Integrated Information System (HURIS)</h1>
                    <p className="mb-6">
                        HURIS is an integrated system that consists of three system modules that support complaint handling, research and education, and monitoring and inspection in human rights commission offices across all regions.
                        The system enhances transparency, accountability, and efficiency in protecting and promoting human rights in Uganda.
                    </p>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Background</h2>
                        <p className="mb-4">
                            The Uganda Human Rights Commission (UHRC) was established under the 1995 Constitution of the Republic of Uganda.
                            The decision to establish a permanent body to monitor the human rights situation in the country was in recognition of Uganda&apos;s
                            violent and turbulent history characterized by arbitrary arrests, detention without trial, torture, and brutal repression with
                            impunity on the part of security organs during the pre and post-independence era.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Commission&apos;s Functions</h2>
                        <p className="mb-2">Article 52(1) of the Uganda Constitution lays down the following functions of the Commission:</p>
                        <ul className="list-disc ml-6">
                            <li>Investigate, at its own initiative or on complaint, any violation of human rights</li>
                            <li>Visit jails, prisons, and places of detention to assess conditions and make recommendations</li>
                            <li>Establish continuing programs of research, education, and information to enhance respect for human rights</li>
                            <li>Recommend effective measures to Parliament, including compensation to victims of human rights violations</li>
                            <li>Create and sustain awareness of constitutional provisions as the fundamental law of Uganda</li>
                            <li>Educate and encourage the public to defend the Constitution against all forms of abuse and violation</li>
                            <li>Formulate and implement programs to inculcate civic responsibilities and appreciation of rights and obligations</li>
                            <li>Monitor the Government&apos;s compliance with international treaty and convention obligations on human rights</li>
                            <li>Perform such other functions as may be provided by law</li>
                        </ul>
                        <p className="mt-4">
                            Article 52(2) requires the Commission to publish periodic reports and submit annual reports to Parliament on the state of human rights and freedoms in the country.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Powers of the Commission</h2>
                        <p className="mb-2">Under Article 53(1) of the Constitution, the UHRC has the power of a court to:</p>
                        <ul className="list-disc ml-6">
                            <li>Summon or order any person to attend and produce relevant documents or records</li>
                            <li>Question any person in respect of any subject matter under investigation</li>
                            <li>Direct any person to disclose information relevant to any investigation</li>
                            <li>Commit persons for contempt of its orders</li>
                        </ul>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Order of Remedies</h2>
                        <p className="mb-2">
                            If satisfied that there has been a violation of human rights or freedom, the Commission may order:
                        </p>
                        <ul className="list-disc ml-6">
                            <li>Release of a detained or restricted person</li>
                            <li>Payment of compensation</li>
                            <li>Any other legal remedy or redress</li>
                        </ul>
                        <p className="mt-2">
                            Any person or authority dissatisfied with an order made by the Commission has the right to appeal to the High Court.
                        </p>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Administrative Structure</h2>

                        <h3 className="text-xl font-semibold mb-2 mt-4">The Commission</h3>
                        <p className="mb-4">
                            The governing body consists of a Chairperson and six other members appointed by the President with approval of Parliament.
                            They serve for six years and are eligible for re-appointment.
                        </p>

                        <h3 className="text-xl font-semibold mb-2">Five Directorates</h3>
                        <ul className="list-disc ml-6 mb-4">
                            <li>Directorate of Complaints, Investigations and Legal Services</li>
                            <li>Directorate of Finance and Administration</li>
                            <li>Directorate of Research, Education and Documentation</li>
                            <li>Directorate of Monitoring and Inspections</li>
                            <li>Directorate of Regional Services</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-2">Regional Offices</h3>
                        <p className="mb-2">
                            The Commission has established nine regional offices to bring services closer to the people:
                        </p>
                        <ul className="list-disc ml-6 mb-4">
                            <li>Arua Regional Office</li>
                            <li>Kampala Central Regional Office</li>
                            <li>Gulu Regional Office</li>
                            <li>Soroti Regional Office</li>
                            <li>Mbarara Regional Office</li>
                            <li>Fort Portal Regional Office</li>
                            <li>Jinja Regional Office</li>
                            <li>Masaka Regional Office</li>
                            <li>Moroto Regional Office</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-2">Field Offices</h3>
                        <p className="mb-2">
                            The Commission maintains seven field offices located in:
                        </p>
                        <ul className="list-disc ml-6">
                            <li>Lira, Pader, and Kitgum (under Gulu Regional Office)</li>
                            <li>Nakapiripirit and Kotido (under Moroto Regional Office)</li>
                            <li>Kapchorwa and Kaberamaido (under Soroti Regional Office)</li>
                        </ul>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">HURIS System Modules</h2>
                        <ul className="list-disc ml-6">
                            <li><strong>Complaint Handling Module:</strong> Streamlines the receipt, investigation, and resolution of human rights complaints</li>
                            <li><strong>Research and Education Module:</strong> Supports ongoing research programs and human rights education initiatives</li>
                            <li><strong>Monitoring and Inspection Module:</strong> Facilitates visits to detention facilities and monitoring of human rights conditions</li>
                        </ul>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Key Benefits of HURIS</h2>
                        <ul className="list-disc ml-6">
                            <li>Enhanced case management and tracking of human rights complaints</li>
                            <li>Improved coordination between regional and field offices</li>
                            <li>Real-time monitoring and reporting capabilities</li>
                            <li>Comprehensive research and education program management</li>
                            <li>Efficient inspection scheduling and documentation</li>
                            <li>Data-driven insights for annual parliamentary reports</li>
                        </ul>
                    </section>

                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Support & Contact</h2>
                        <p>
                            For inquiries or to report human rights violations, contact the Uganda Human Rights Commission:
                        </p>
                        <ul className="list-disc ml-6 mt-2">
                            <li>Email: <a href="mailto:uhrc@uhrc.ug" className="text-blue-500">uhrc@uhrc.ug</a></li>
                            <li>Website: <a href="https://www.uhrc.ug" className="text-blue-500" target="_blank" rel="noopener noreferrer">www.uhrc.ug</a></li>
                            <li>Visit any of the regional or field offices near you</li>
                        </ul>
                    </section>
                </div>
            </Card>
        </>
    );
};

export default AboutUsPage;