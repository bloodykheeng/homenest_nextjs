import React from 'react';

interface Cso {
    id: number;
    name: string;
}

interface OversightInstitution {
    id: number;
    name: string;
}

interface State {
    id: number;
    name: string;
}

interface Region {
    id: number;
    name: string;
}

interface District {
    id: number;
    name: string;
}

interface Ward {
    id: number;
    name: string;
}

interface Village {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}



interface NotificationRecordDetails {
    target_audience?: string;
    scope?: string;
    gender?: string;
    csos?: Cso[];
    oversight_institutions?: OversightInstitution[];
    states?: State[];
    regions?: Region[];
    districts?: District[];
    wards?: Ward[];
    villages?: Village[];
    users?: User[];
}

interface NotificationRespondentsInfoProps {
    recordDetails: NotificationRecordDetails;
}

const NotificationRespondentsInfo: React.FC<NotificationRespondentsInfoProps> = ({ recordDetails }) => {
    const targetAudience = recordDetails?.target_audience || "N/A";
    const scope = recordDetails?.scope || null;
    const gender = recordDetails?.gender || null;

    const renderCsos = () => {
        if (!recordDetails?.csos || recordDetails.csos.length === 0) {
            return <p>No CSOs were selected for this notification.</p>;
        }

        return (
            <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                    {recordDetails.csos.map((cso) => (
                        <span
                            key={cso.id}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {cso?.name || "Unknown CSO"}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderOversightInstitutions = () => {
        if (!recordDetails?.oversight_institutions || recordDetails.oversight_institutions.length === 0) {
            return <p>No Oversight Institutions were selected for this notification.</p>;
        }

        return (
            <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                    {recordDetails.oversight_institutions.map((institution) => (
                        <span
                            key={institution.id}
                            className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                        >
                            {institution?.name || "Unknown Institution"}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderStates = () => {
        if (!recordDetails?.states || recordDetails.states.length === 0) {
            return <p>No States were selected.</p>;
        }

        return (
            <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                    {recordDetails.states.map((state) => (
                        <span
                            key={state.id}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                            {state?.name || "Unknown State"}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderRegions = () => {
        if (!recordDetails?.regions || recordDetails.regions.length === 0) {
            return <p>No Regions were selected.</p>;
        }

        return (
            <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                    {recordDetails.regions.map((region) => (
                        <span
                            key={region.id}
                            className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                        >
                            {region?.name || "Unknown Region"}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderDistricts = () => {
        if (!recordDetails?.districts || recordDetails.districts.length === 0) {
            return <p>No Districts were selected.</p>;
        }

        return (
            <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                    {recordDetails.districts.map((district) => (
                        <span
                            key={district.id}
                            className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm"
                        >
                            {district?.name || "Unknown District"}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderWards = () => {
        if (!recordDetails?.wards || recordDetails.wards.length === 0) {
            return <p>No Wards were selected.</p>;
        }

        return (
            <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                    {recordDetails.wards.map((ward) => (
                        <span
                            key={ward.id}
                            className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm"
                        >
                            {ward?.name || "Unknown Ward"}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderVillages = () => {
        if (!recordDetails?.villages || recordDetails.villages.length === 0) {
            return <p>No Villages were selected.</p>;
        }

        return (
            <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                    {recordDetails.villages.map((village) => (
                        <span
                            key={village.id}
                            className="px-3 py-1 bg-lime-100 text-lime-800 rounded-full text-sm"
                        >
                            {village?.name || "Unknown Village"}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderUsers = () => {
        if (!recordDetails?.users || recordDetails.users.length === 0) {
            return <p>No specific users were selected for this notification.</p>;
        }

        return (
            <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                    {recordDetails.users.map((user) => (
                        <span
                            key={user.id}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                            {user?.name || "Unknown User"}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const renderGender = () => {
        if (!gender) {
            return <p>No gender filter applied.</p>;
        }

        return (
            <div className="mt-1">
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                    {gender}
                </span>
            </div>
        );
    };

    return (
        <div>
            <h4 className="text-lg font-semibold mb-3 border-b pb-1">Target Audience Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <p className="font-medium mb-1">Target Audience</p>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {targetAudience}
                    </span>
                </div>

                {scope && (
                    <div>
                        <p className="font-medium mb-1">Scope</p>
                        <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm">
                            {scope}
                        </span>
                    </div>
                )}

                <div>
                    <p className="font-medium mb-1">Gender</p>
                    {renderGender()}
                </div>

                {targetAudience === "CSOs" && (
                    <div className="col-span-2">
                        <p className="font-medium mb-1">CSOs</p>
                        {renderCsos()}
                    </div>
                )}

                {targetAudience === "Oversight Institutions" && (
                    <div className="col-span-2">
                        <p className="font-medium mb-1">Oversight Institutions</p>
                        {renderOversightInstitutions()}
                    </div>
                )}

                {targetAudience === "Geographical" && scope && (
                    <>
                        {["States", "Regions", "Districts", "Wards", "Villages"].includes(scope) && (
                            <div className="col-span-2">
                                <p className="font-medium mb-1">States</p>
                                {renderStates()}
                            </div>
                        )}

                        {["Regions", "Districts", "Wards", "Villages"].includes(scope) && (
                            <div className="col-span-2">
                                <p className="font-medium mb-1">Regions</p>
                                {renderRegions()}
                            </div>
                        )}

                        {["Districts", "Wards", "Villages"].includes(scope) && (
                            <div className="col-span-2">
                                <p className="font-medium mb-1">Districts</p>
                                {renderDistricts()}
                            </div>
                        )}

                        {["Wards", "Villages"].includes(scope) && (
                            <div className="col-span-2">
                                <p className="font-medium mb-1">Wards</p>
                                {renderWards()}
                            </div>
                        )}

                        {scope === "Villages" && (
                            <div className="col-span-2">
                                <p className="font-medium mb-1">Villages</p>
                                {renderVillages()}
                            </div>
                        )}
                    </>
                )}

                {targetAudience === "Users" && (
                    <div className="col-span-2">
                        <p className="font-medium mb-1">Selected Users</p>
                        {renderUsers()}
                    </div>
                )}

                {targetAudience === "All Users" && (
                    <div className="col-span-2">
                        <p className="font-medium mb-1">Target</p>
                        <p>This notification is targeted to all Users.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationRespondentsInfo;