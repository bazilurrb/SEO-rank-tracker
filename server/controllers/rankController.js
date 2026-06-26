import KeywordTracking from "../models/keywordTracking";


// Add a keyword to Track
export const addKeyword = async (req, res) => {
    try{
        const {keyword, url} = req.body;

        if(!keyword || !url) return res.status(400).json({success: false, message: "Keyword and URL are required"});

        // Extract domain from url
        let domain;
        try{
            const urlObj = new URL(url.startsWith("http")? url : `http://${url}`);
            domain = urlObj.hostname.replace("www.", "");
        } catch {
            return res.status(400).json({success: false, message: "Invalid URL format"});
        }

        //Check if already tracking this keyword+domain
        const existing = await KeywordTracking.findOne({userId: req.userId, keyword: keyword.toLowerCase().trim(), domain});

        if(existing){
            return res.status(400).json({success: false, message: "Already tracking this keyword for this domain"});
        }

        // Create tracking entry
        const tracking = await KeywordTracking.create({
            userId: req.userId,
            keyword: keyword.toLowerCase().trim(),
            url: url.startsWith("http")? url : `http://${url}`,
            domain,
            status: "checking"
        })

        res.status(201).json({success: true, message: "Keyword tracking started", tracking});

    } catch(error){

    }
}

// Get all tracked keyword for user
export const getKeywords = async (req, res) => {
    
}

// Get single keyword with full history
export const getKeyword = async (req, res) => {
    
}

// Delete keyword tracking
export const deleteKeyword = async (req, res) => {
    
}

// Toggle keyword tracking active/inactive
export const toggleTracking = async (req, res) => {
    
}