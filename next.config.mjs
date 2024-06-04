/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login", // Gantilah dengan path tujuan yang diinginkan
        permanent: true, // Ganti menjadi false jika ingin menggunakan redirect sementara (status kode 302)
      },
    ];
  },
};

export default nextConfig;
