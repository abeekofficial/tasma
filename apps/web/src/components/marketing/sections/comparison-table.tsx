import React from "react";
import { Check, Minus } from "lucide-react";

export function ComparisonTable() {
  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Projects", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Users per project", free: "1", pro: "Up to 10", enterprise: "Unlimited" },
        { name: "Storage", free: "1GB", pro: "50GB", enterprise: "500GB+" },
      ],
    },
    {
      category: "Analytics & Reporting",
      items: [
        { name: "Basic Analytics", free: true, pro: true, enterprise: true },
        { name: "Custom Reports", free: false, pro: true, enterprise: true },
        { name: "Data Export", free: false, pro: true, enterprise: true },
        { name: "Real-time Dashboard", free: false, pro: false, enterprise: true },
      ],
    },
    {
      category: "Support",
      items: [
        { name: "Community Support", free: true, pro: true, enterprise: true },
        { name: "Email Support", free: false, pro: true, enterprise: true },
        { name: "Priority Response", free: false, pro: "24h SLA", enterprise: "1h SLA" },
        { name: "Dedicated Manager", free: false, pro: false, enterprise: true },
      ],
    },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-5 h-5 text-primary mx-auto" />
      ) : (
        <Minus className="w-5 h-5 text-muted-foreground/50 mx-auto" />
      );
    }
    return <span className="font-medium">{val}</span>;
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Compare plans
          </h2>
          <p className="text-muted-foreground text-lg">
            Find the features that match your needs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="p-4 border-b w-1/3"></th>
                <th className="p-4 border-b text-center font-semibold text-lg">Free</th>
                <th className="p-4 border-b text-center font-semibold text-lg text-primary">Pro</th>
                <th className="p-4 border-b text-center font-semibold text-lg">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((section, idx) => (
                <React.Fragment key={section.category}>
                  <tr>
                    <td
                      colSpan={4}
                      className="bg-muted/30 p-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground pt-8"
                    >
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, itemIdx) => (
                    <tr
                      key={item.name}
                      className={`group hover:bg-muted/10 transition-colors ${
                        itemIdx !== section.items.length - 1 ? "border-b border-border/50" : ""
                      }`}
                    >
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4 text-center">{renderValue(item.free)}</td>
                      <td className="p-4 text-center bg-primary/5">{renderValue(item.pro)}</td>
                      <td className="p-4 text-center">{renderValue(item.enterprise)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
