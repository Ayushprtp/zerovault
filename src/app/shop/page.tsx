import ShopCard from '@/components/ShopCard';
import { createClient } from '@/utils/supabase/server';

export default async function ShopPage() {
  const supabase = createClient();

  // You would typically fetch membership tiers and coin packs from your database here
  // For now, we'll use dummy data based on the GEMINI.md description.
  const memberships = [
    { name: 'Basic Membership', benefits: ['Access to core services'], telegramMessage: 'Hello, I am interested in the Basic Membership.' },
    { name: 'Pro Membership', benefits: ['Access to all services', 'Higher RPM'], telegramMessage: 'Hello, I am interested in the Pro Membership.' },
    { name: 'Elite Membership', benefits: ['Priority access', 'Highest RPM', 'Dedicated support'], telegramMessage: 'Hello, I am interested in the Elite Membership.' },
  ];

  const coinPacks = [
    { amount: 100, priceDescription: 'Small Pack', telegramMessage: 'Hello, I am interested in the 100 ZeroCoin Pack.' },
    { amount: 500, priceDescription: 'Medium Pack', telegramMessage: 'Hello, I am interested in the 500 ZeroCoin Pack.' },
    { amount: 1000, priceDescription: 'Large Pack', telegramMessage: 'Hello, I am interested in the 1000 ZeroCoin Pack.' },
  ];

  // You would fetch the admin's Telegram username from the site_settings table
  const { data: settings, error: settingsError } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'admin_telegram_username')
    .single();

  const adminUsername = settings?.value || 'YOUR_ADMIN_TELEGRAM_USERNAME'; // Replace with a default or handle error

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">ZeroVault Shop</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Membership Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((membership, index) => (
            <ShopCard
              key={index}
              title={membership.name}
              benefits={membership.benefits}
              telegramLink={`https://t.me/${adminUsername}?text=${encodeURIComponent(membership.telegramMessage)}`}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">ZeroCoin Packs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coinPacks.map((pack, index) => (
            <ShopCard
              key={index}
              title={`${pack.amount} ZeroCoins`}
              benefits={[`${pack.priceDescription}`]}
              telegramLink={`https://t.me/${adminUsername}?text=${encodeURIComponent(pack.telegramMessage)}`}
              isCoinPack={true}
            />
          ))}
        </div>
      </section>
    </div>
  );
}