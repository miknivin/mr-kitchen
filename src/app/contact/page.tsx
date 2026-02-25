'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useCreateEnquiryMutation } from '@/redux/api/enquiryApi';
import { toast } from 'sonner';
// import imgMap from "../../assets/fa249671241ea75ce1a6347b416714b0ae3f003a.png"; // Fixed path from figma:asset

const ContactCard = ({ title, content, icon: Icon, delay }: { title: string, content: React.ReactNode, icon: any, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="bg-[#bd7400]/15 border border-[#a87522] rounded-[25px] p-8 flex flex-col items-center text-center hover:bg-[#bd7400]/25 transition-colors duration-300 min-h-[323px] w-full max-w-[359px]"
    >
        <div className="w-[108px] h-[108px] bg-[#d9d9d9] rounded-full flex items-center justify-center mb-6 shrink-0">
            <Icon size={48} className="text-[#4a2f03]" strokeWidth={1.5} />
        </div>

        <h3 className="font-['Poppins'] font-semibold text-[25px] text-white mb-4">
            {title}
        </h3>

        <div className="font-['Poppins'] font-medium text-[16px] text-white/75 leading-relaxed">
            {content}
        </div>
    </motion.div>
);

const InputField = ({ placeholder, type = "text", className = "" }: { placeholder: string, type?: string, className?: string }) => (
    <input
        type={type}
        placeholder={placeholder}
        className={`w-full h-[52px] bg-[#d9d9d9] rounded-[25px] px-6 font-['Poppins'] font-medium text-[16px] placeholder:text-black/50 text-black outline-none focus:ring-2 focus:ring-[#a87522] transition-all ${className}`}
    />
);

export default function ContactPage() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [message, setMessage] = React.useState('');

    const [createEnquiry, { isLoading }] = useCreateEnquiryMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createEnquiry({ name, email, phone, subject, message }).unwrap();
            toast.success("Message sent successfully!");
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');
        } catch (err) {
            toast.error("Failed to send message");
        }
    };

    return (
        <div className="min-h-screen bg-black pt-[100px] pb-20 overflow-x-hidden text-[#e5e5e5]">

            {/* Title */}
            <Reveal width="100%" className="text-center mb-16">
                <h1 className="font-['Poppins'] font-medium text-[40px] md:text-[50px]">Contact</h1>
            </Reveal>

            {/* Contact Cards */}
            <section className="container mx-auto px-6 lg:px-[139px] mb-24">
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    <ContactCard
                        title="Office Address"
                        icon={MapPin}
                        delay={0.1}
                        content={
                            <>
                                ACB Enterprises<br />
                                PARAPPANPOYIL (P.O),<br />
                                THAMARASSERY KOZHIKODE, Kerala
                            </>
                        }
                    />
                    <ContactCard
                        title="Email"
                        icon={Mail}
                        delay={0.2}
                        content={
                            <a href="mailto:acbenterprises16@gmail.com" className="hover:text-[#a87522] transition-colors">
                                acbenterprises16@gmail.com
                            </a>
                        }
                    />
                    <ContactCard
                        title="Phone"
                        icon={Phone}
                        delay={0.3}
                        content={
                            <a href="tel:+917025984447" className="hover:text-[#a87522] transition-colors">
                                +91 7025984447
                            </a>
                        }
                    />
                </div>
            </section>

            {/* Send Message Section */}
            <section className="container mx-auto px-6 lg:px-[139px] mb-24">
                <Reveal width="100%" className="text-center mb-16">
                    <h2 className="font-['Poppins'] font-medium text-[35px] md:text-[50px] text-[#e5e5e5]">
                        <span className="text-[#acacac]">Send Us a </span>
                        <span className="bg-gradient-to-r from-[#4a2f03] via-[#aa7722] to-[#cc973f] bg-clip-text text-transparent">Message</span>
                    </h2>
                </Reveal>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit}
                    className="max-w-[1200px] mx-auto flex flex-col gap-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            placeholder="Full Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-[52px] bg-[#d9d9d9] rounded-[25px] px-6 font-['Poppins'] font-medium text-[16px] placeholder:text-black/50 text-black outline-none focus:ring-2 focus:ring-[#a87522] transition-all"
                        />
                        <input
                            placeholder="Email Address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[52px] bg-[#d9d9d9] rounded-[25px] px-6 font-['Poppins'] font-medium text-[16px] placeholder:text-black/50 text-black outline-none focus:ring-2 focus:ring-[#a87522] transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            placeholder="Phone Number"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-[52px] bg-[#d9d9d9] rounded-[25px] px-6 font-['Poppins'] font-medium text-[16px] placeholder:text-black/50 text-black outline-none focus:ring-2 focus:ring-[#a87522] transition-all"
                        />
                        <input
                            placeholder="Subject"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full h-[52px] bg-[#d9d9d9] rounded-[25px] px-6 font-['Poppins'] font-medium text-[16px] placeholder:text-black/50 text-black outline-none focus:ring-2 focus:ring-[#a87522] transition-all"
                        />
                    </div>

                    <textarea
                        placeholder="Message"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-[182px] bg-[#d9d9d9] rounded-[25px] p-6 font-['Poppins'] font-medium text-[16px] placeholder:text-black/50 text-black outline-none focus:ring-2 focus:ring-[#a87522] transition-all resize-none"
                    />

                    <div className="flex justify-end mt-4">
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-[#a87522] to-[#774b03] px-12 py-4 rounded-[25px] font-['Poppins'] font-semibold text-[20px] md:text-[25px] text-[#e5e5e5] shadow-lg shadow-[#a87522]/30 disabled:opacity-50"
                        >
                            {isLoading ? "Sending..." : "Send Now"}
                        </motion.button>
                    </div>
                </motion.form>
            </section>

            {/* Map Section */}
            {/* <section className="container mx-auto px-6 lg:px-[139px] mb-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-[25px] overflow-hidden border border-[#a87522]/30 relative group"
                > */}
            {/* <img
                        src={typeof imgMap === 'string' ? imgMap : imgMap.src}
                        alt="Location Map"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    /> */}

            {/* Map Pin Overlay Animation */}
            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                        >
                            <MapPin className="w-12 h-12 text-[#a87522] drop-shadow-lg fill-[#a87522]/20" />
                        </motion.div>
                    </div>
                </motion.div>
            </section> */}

        </div>
    );
};
