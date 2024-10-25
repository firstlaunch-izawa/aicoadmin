import { ClientSample } from '@/components/ClientSample';

export default function SamplePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Client Sample Program</h1>
      <ClientSample clientId="aico001" />
    </div>
  );
}