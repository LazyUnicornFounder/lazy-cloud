export default function AdminPlaceholderPage({ name }: { name: string }) {
  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-4">{name}</h1>
      <div className="border border-[#f0ead6]/8 p-8 text-center">
        <p className="font-body text-sm text-[#f0ead6]/75">{name} agent is not yet installed in this project.</p>
        <p className="font-body text-xs text-[#f0ead6]/68 mt-2">Visit the product page to copy the setup prompt and install it.</p>
      </div>
    </div>
  );
}
