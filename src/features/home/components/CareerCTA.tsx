
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CareerCTA() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-default">
        <div className="relative overflow-hidden rounded-3xl bg-brand-primary px-6 py-16 text-center sm:px-12 sm:py-20">

          {/* Decorative Background */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full border border-white/10" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <Sparkles size={16} />
              Your Future Starts Today
            </div>

            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Take the Next Step in Your Career?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Join CareerBridge MM and discover opportunities
              that help you grow, learn, and build your future
              in the IT industry.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-lg bg-white px-7 py-3.5
                  text-sm font-semibold text-brand-primary
                  transition-all duration-200 ease-out
                  hover:bg-white/90 hover:shadow-lg
                  active:scale-95
                "
              >
                Create Your Account
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/job"
                className="
                  inline-flex items-center justify-center
                  rounded-lg border border-white/30 px-7 py-3.5
                  text-sm font-semibold text-white
                  transition-all duration-200 ease-out
                  hover:bg-white/10
                  active:scale-95
                "
              >
                Explore Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
