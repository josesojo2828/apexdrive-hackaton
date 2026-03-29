"use client";

import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Icon } from "@/components/atoms/Icon";
import { Spinner } from "@/components/atoms/Spinner";
import { Avatar } from "@/components/molecules/Avatar";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/molecules/Card";
import { Alert } from "@/components/molecules/Alert";
import { UserCard } from "@/components/molecules/UserCard";
import { PasswordInput } from "@/components/molecules/PasswordInput";
import { SearchInput } from "@/components/molecules/SearchInput";
import { useAlertStore } from "@/store/useAlertStore";
import { useModalStore } from "@/store/useModalStore";

const DesignPage = () => {
    const { addAlert } = useAlertStore();
    const { openModal } = useModalStore();

    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-12 pb-32">
            <div className="max-w-4xl mx-auto space-y-12">
                <Typography variant="H1">Design System</Typography>

                {/* Brand Identity Section */}
                <section className="space-y-8">
                    <Typography variant="H2" className="border-b pb-2">Speed Delivery Identity</Typography>

                    {/* Logo Preview */}
                    <div className="p-8 rounded-xl bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white text-center shadow-lg">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-xs tracking-widest opacity-80">MVP FASE 1</span>
                        </div>
                        <h1 className="text-6xl font-sans font-bold tracking-[0.2em] mb-4">
                            SPEED <span className="relative">DELIVERY<span className="absolute -top-1 -right-6 text-2xl">⚡</span></span>
                        </h1>
                        <p className="font-serif italic text-lg opacity-90 mt-4">
                            Servicios y negocios latinos en Japón, en un solo lugar.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Typography variant="H4">Speed Delivery Colors</Typography>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg bg-brand-blue shadow-sm flex items-end p-2">
                                    <span className="text-white text-xs font-mono">#1e40af</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">Royal Blue</p>
                                    <p className="text-gray-500">Footer / Deep</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg bg-brand-sky shadow-sm flex items-end p-2">
                                    <span className="text-white text-xs font-mono">#38bdf8</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">Light Sky</p>
                                    <p className="text-gray-500">Gradient Start</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end shadow-sm flex items-end p-2">
                                    <span className="text-white text-xs font-mono">Gradient</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">Brand Gradient</p>
                                    <p className="text-gray-500">Header / Hero</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg bg-brand-slate shadow-sm flex items-end p-2">
                                    <span className="text-white text-xs font-mono">#0f172a</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">Brand Slate</p>
                                    <p className="text-gray-500">Text / Dark BG</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-24 w-full rounded-lg bg-speed-alert shadow-sm flex items-end p-2">
                                    <span className="text-white text-xs font-mono">#ef4444</span>
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">Restriction Red</p>
                                    <p className="text-gray-500">Warnings / Notes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mt-8">
                        <Typography variant="H4">Typography Pairings</Typography>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 bg-gray-50 rounded-lg space-y-4">
                                <span className="text-xs text-brand-blue font-bold tracking-wider">HEADINGS & BODY (SERIF)</span>
                                <h2 className="text-3xl font-serif font-bold text-gray-900">
                                    Directorios y Comunidades
                                </h2>
                                <p className="font-serif text-gray-700 leading-relaxed">
                                    &quot;Centralizar información, generar confianza y captar leads. No marketplace, no pagos complejos.&quot;
                                </p>
                                <p className="text-xs text-gray-400 mt-2">Font: Merriweather</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-lg space-y-4">
                                <span className="text-xs text-brand-blue font-bold tracking-wider">BRAND & UI (SANS)</span>
                                <h2 className="text-3xl font-sans font-bold text-gray-900 tracking-widest">
                                    SPEED DELIVERY
                                </h2>
                                <button className="px-6 py-2 bg-brand-blue text-white rounded font-sans text-sm font-medium">
                                    EXPLORAR DIRECTORIO
                                </button>
                                <p className="text-xs text-gray-400 mt-2">Font: Montserrat</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography Section */}
                <section className="space-y-4">
                    <Typography variant="H2" className="border-b pb-2">Typography</Typography>
                    <div className="space-y-2">
                        <Typography variant="H1">Heading 1</Typography>
                        <Typography variant="H2">Heading 2</Typography>
                        <Typography variant="H3">Heading 3</Typography>
                        <Typography variant="H4">Heading 4</Typography>
                        <Typography variant="P">Paragraph: The quick brown fox jumps over the lazy dog.</Typography>
                        <Typography variant="CAPTION">Caption text example</Typography>
                    </div>
                </section>

                {/* Buttons Section */}
                <section className="space-y-4">
                    <Typography variant="H2" className="border-b pb-2">Buttons</Typography>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button variant="PRIMARY">Primary</Button>
                        <Button variant="SECONDARY">Secondary</Button>
                        <Button variant="OUTLINE">Outline</Button>
                        <Button variant="GHOST">Ghost</Button>
                        <Button variant="SUCCESS">Success</Button>
                        <Button variant="WARNING">Warning</Button>
                        <Button variant="ERROR">Error</Button>
                        <Button variant="INFO">Info</Button>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button size="SM">Small</Button>
                        <Button size="MD">Medium</Button>
                        <Button size="LG">Large</Button>
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                        <Button isLoading>Loading</Button>
                        <Button leftIcon={<Icon icon="home" className="w-4 h-4" />}>Left Icon</Button>
                        <Button rightIcon={<Icon icon="settings" className="w-4 h-4" />}>Right Icon</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                </section>

                {/* Inputs Section */}
                <section className="space-y-4">
                    <Typography variant="H2" className="border-b pb-2">Inputs</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Default Input" />
                        <Input placeholder="Input with Label" label="Username" />
                        <Input placeholder="Error State" label="Email" error="Invalid email address" />
                        <SearchInput placeholder="Search..." onClear={() => console.log("Cleared")} />
                        <PasswordInput placeholder="Password" label="Password" />
                    </div>
                </section>

                {/* Global State Demo - Alerts */}
                <section className="space-y-4">
                    <Typography variant="H2" className="border-b pb-2">Global Alerts</Typography>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            variant="SUCCESS"
                            onClick={() => addAlert("Operation successful!", "success")}
                        >
                            Trigger Success Alert
                        </Button>
                        <Button
                            variant="ERROR"
                            onClick={() => addAlert("Something went wrong!", "error")}
                        >
                            Trigger Error Alert
                        </Button>
                        <Button
                            variant="WARNING"
                            onClick={() => addAlert("Please be careful.", "warning")}
                        >
                            Trigger Warning Alert
                        </Button>
                        <Button
                            variant="INFO"
                            onClick={() => addAlert("Here is some info.", "info")}
                        >
                            Trigger Info Alert
                        </Button>
                    </div>
                </section>

                {/* Global State Demo - Modals */}
                <section className="space-y-4">
                    <Typography variant="H2" className="border-b pb-2">Global Modals</Typography>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            onClick={() => openModal("DEMO_MODAL", { message: "Hello from the global modal!" })}
                        >
                            Open Demo Modal
                        </Button>
                    </div>
                </section>

                {/* Static Molecules */}
                <section className="space-y-4">
                    <Typography variant="H2" className="border-b pb-2">Molecules</Typography>

                    <div className="space-y-4">
                        <Typography variant="H4">Static Alerts</Typography>
                        <Alert variant="info" title="Information">This is a static info alert.</Alert>
                        <Alert variant="warning" title="Warning">This is a static warning alert.</Alert>
                    </div>

                    <div className="space-y-4">
                        <Typography variant="H4">Cards</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader><Typography variant="H4">Card Title</Typography></CardHeader>
                                <CardBody><Typography>This is the card body content.</Typography></CardBody>
                                <CardFooter><Button size="SM">Action</Button></CardFooter>
                            </Card>
                            <Card className="p-4 flex items-center justify-center">
                                <UserCard name="John Doe" email="john@example.com" status="online" />
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Typography variant="H4">Avatars</Typography>
                        <div className="flex gap-4">
                            <Avatar initials="JD" status="online" />
                            <Avatar initials="AB" status="busy" />
                            <Avatar initials="OFF" status="offline" />
                        </div>
                    </div>
                </section>

                {/* Icons & Spinners */}
                <section className="space-y-4">
                    <Typography variant="H2" className="border-b pb-2">Icons & Loaders</Typography>
                    <div className="flex gap-4 items-center">
                        <Icon icon="home" className="w-6 h-6" />
                        <Icon icon="user" className="w-6 h-6" />
                        <Icon icon="bell" className="w-6 h-6" />
                        <Spinner size="sm" />
                        <Spinner size="md" />
                        <Spinner size="lg" />
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DesignPage;
