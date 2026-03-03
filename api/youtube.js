// api/youtube.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST metoduna izin verilir' });
    }

    try {
        const { query } = req.body; // Ön yüzden gelen arama terimi (Örn: "Aviation English B1")
        
        // Vercel'deki gizli YouTube anahtarımız
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; 

        // YouTube'un beynine giden canlı arama linki (Sadece videoları ve her seferinde en iyi 9 sonucu getirir)
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=9&key=${YOUTUBE_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();
        
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
