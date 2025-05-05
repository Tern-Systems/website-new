import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Get in Touch
        </h1>
        <ContactForm />
      </div>
    </main>
  );
} 