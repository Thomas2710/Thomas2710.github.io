import '@/app/ui/global.css';
import Header from './Header' 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#444444', color: '#e2e8f0' }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
