import React from "react";
import { Card } from "primereact/card";
import { FiHome, FiStar, FiTruck, FiShield, FiUsers, FiHeart } from "react-icons/fi";

const values = [
    {
        icon: <FiHome className="text-3xl text-primary" />,
        title: "Home-First Philosophy",
        description:
            "Every product we carry is chosen with one question in mind: does it make a home more comfortable, more functional, and more beautiful?",
    },
    {
        icon: <FiStar className="text-3xl text-primary" />,
        title: "Quality You Can Trust",
        description:
            "We rigorously vet every item in our catalogue. If it does not meet our standards for durability and finish, it does not reach your doorstep.",
    },
    {
        icon: <FiTruck className="text-3xl text-primary" />,
        title: "Reliable Delivery",
        description:
            "From Kampala to every corner of Uganda, we ensure your orders arrive safely and on time — no excuses, no surprises.",
    },
    {
        icon: <FiShield className="text-3xl text-primary" />,
        title: "Safe & Secure Shopping",
        description:
            "Your data and payments are protected with industry-standard encryption. Shop with complete confidence every time.",
    },
    {
        icon: <FiUsers className="text-3xl text-primary" />,
        title: "Community-Driven",
        description:
            "HomeNest was built by Ugandans, for Ugandan families. Customer feedback directly shapes our catalogue and service improvements.",
    },
    {
        icon: <FiHeart className="text-3xl text-primary" />,
        title: "Customer Happiness",
        description:
            "Our 24 / 7 support team is always on standby. We measure success by how satisfied you feel long after the purchase.",
    },
];

const AboutUsPage = () => {
    return (
        <div className="text-gray-800 dark:text-white space-y-10">
            {/* Hero blurb */}
            <Card className="shadow-none border border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold mb-4 text-dark dark:text-white">
                    Welcome to HomeNest
                </h1>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    HomeNest is Uganda&apos;s trusted online destination for quality household essentials,
                    modern home décor, and everyday comfort items. We believe that a well-furnished,
                    thoughtfully arranged home is not a luxury — it is the foundation of a happy,
                    productive life.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Whether you are setting up your first apartment, refreshing your living room, or
                    searching for the perfect gift, HomeNest brings thousands of curated products
                    straight to your door at fair, transparent prices.
                </p>
            </Card>

            {/* Our story */}
            <section>
                <h2 className="text-2xl font-semibold mb-3 text-dark dark:text-white">Our Story</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 leading-relaxed text-gray-600 dark:text-gray-300 space-y-3">
                    <p>
                        HomeNest was founded with a simple observation: buying quality home goods in Uganda
                        was either expensive, inconsistent, or required travelling across the city. We set out
                        to change that.
                    </p>
                    <p>
                        Starting with a small catalogue of kitchen and bedroom essentials, we quickly grew as
                        customers shared our platform with friends and family. Today HomeNest stocks thousands
                        of products across furniture, bedding, kitchen appliances, bathroom accessories,
                        décor, and much more — all searchable, filterable, and deliverable nationwide.
                    </p>
                    <p>
                        We partner with trusted local and international suppliers, negotiate the best prices,
                        and pass those savings directly to you. Our warehouse team hand-inspects every order
                        before dispatch so that what arrives at your door matches what you saw on screen.
                    </p>
                </div>
            </section>

            {/* Our values */}
            <section>
                <h2 className="text-2xl font-semibold mb-6 text-dark dark:text-white">What We Stand For</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {values.map((v, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-3 p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                        >
                            {v.icon}
                            <h3 className="font-semibold text-dark dark:text-white">{v.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                {v.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feel & look */}
            <section>
                <h2 className="text-2xl font-semibold mb-3 text-dark dark:text-white">
                    The HomeNest Feel
                </h2>
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-6 text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
                    <p>
                        From the moment you land on our platform, you will notice a clean, warm aesthetic
                        that mirrors the comfort we promise for your home. Navigation is intentional —
                        categories are broad enough to browse freely but granular enough to find exactly
                        what you need in seconds.
                    </p>
                    <p>
                        Product pages feature high-resolution images, honest descriptions, real customer
                        reviews, and transparent pricing in Ugandan Shillings. No hidden charges, no
                        confusing currency conversions.
                    </p>
                    <p>
                        Our dark-mode-friendly design means you can browse comfortably at any hour, and
                        our mobile layout ensures the full HomeNest experience fits right in your pocket.
                    </p>
                </div>
            </section>

            {/* Contact callout */}
            <section>
                <h2 className="text-2xl font-semibold mb-3 text-dark dark:text-white">
                    Get in Touch
                </h2>
                <Card className="shadow-none border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Have a question, a partnership proposal, or just want to say hello? Our team loves
                        hearing from the HomeNest community.
                    </p>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                        <li>
                            <span className="font-medium">Phone:</span>{" "}
                            <a href="tel:+256788401004" className="text-primary hover:underline">
                                (+256) 7884-01004
                            </a>{" "}
                            — available 24 / 7
                        </li>
                        <li>
                            <span className="font-medium">Email:</span>{" "}
                            <a href="mailto:support@homenest.ug" className="text-primary hover:underline">
                                support@homenest.ug
                            </a>
                        </li>
                        <li>
                            <span className="font-medium">Location:</span> Kampala, Uganda
                        </li>
                    </ul>
                </Card>
            </section>
        </div>
    );
};

export default AboutUsPage;
