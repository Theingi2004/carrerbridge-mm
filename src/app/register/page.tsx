import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-brand-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="flex items-center justify-center gap-2"
        >
          <BriefcaseBusiness className="text-brand-primary" size={30} />
          <span className="text-xl font-bold text-brand-primary">
            CareerBridge MM
          </span>
        </Link>

        <div className="mb-7 mt-8 text-center">
          <h1 className="text-2xl font-bold text-brand-text">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start building your career journey with us.
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}