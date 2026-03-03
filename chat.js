// api/chat.js
export default async function handler(req, res) {
    // Sadece POST isteklerini kabul et
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST metoduna izin verilir' });
    }

    try {
        // Ön yüzden (app.js) gelen veriyi (prompt) al ve OpenAI'a gönder
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // GİZLİ ANAHTAR BURADA DEVREYE GİRİYOR (Kullanıcılar bunu asla göremez)
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        // OpenAI'dan gelen cevabı tekrar ön yüze (app.js) gönder
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}