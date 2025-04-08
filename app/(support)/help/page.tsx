"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, LifeBuoy, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const faqs = [
  {
    question: "How do I start a new chess game?",
    answer:
      "Navigate to the 'Play' section and choose between computer or online multiplayer modes.",
  },
  {
    question: "Can I analyze my past games?",
    answer:
      "Yes, all your games are saved in the 'History' section where you can review and analyze them.",
  },
  {
    question: "What time controls are available?",
    answer:
      "We offer blitz, rapid, and classical time controls ranging from 1 minute to 60 minutes per player.",
  },
];

export default function HelpPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      axios.post("/api/support/help", {
        name: values.name,
        email: values.email,
        message: values.message,
      });
      toast.success("Message sent successfully!");
      setSuccess(true);
    } catch {
      toast.error("Error sending message");
    } finally {
      setLoading(false);
    }
    form.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8 p-6 w-full"
    >
      <motion.h1
        className="text-3xl font-bold text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        Help Center
      </motion.h1>

      {/* FAQ Section */}
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-4 rounded-xl">
              <button
                className="w-full text-left flex justify-between items-center"
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-2xl">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </button>
              {activeIndex === index && (
                <motion.p
                  className="pt-2 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {faq.answer}
                </motion.p>
              )}
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <Card className="p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-4">
                <LifeBuoy className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Support Channels</h3>
                  <p className="text-muted-foreground">
                    We're here to help 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-muted-foreground">xiisagnik@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Response Time</h3>
                  <p className="text-muted-foreground">
                    Typically within 12 hours
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            {success && (
              <Alert>
                <AlertTitle>Message Sent!</AlertTitle>
                <AlertDescription>
                  We'll respond to your inquiry within 12 hours
                </AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="your@email.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your issue..."
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loading ? (
                  <Button disabled type="submit" className="w-full">
                    <Loader2 className="animate-spin" />
                    Sending...
                  </Button>
                ) : (
                  <Button type="submit" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                )}
              </form>
            </Form>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
