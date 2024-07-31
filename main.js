javascript:(async function() {
    var baseUrl="https://didattica.polito.it/portal/pls/portal/";

    /* creazione attributo replaceAll per le stringhe */
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    console.log("Getting links...");

    /* prendo tutto il contetnuo della pagina */
    var htmlContent=document.documentElement.innerHTML;
    var reg=/href="(sviluppo\.videolezioni\.vis.*lez=[0-9]*)">/gi;
    var matches, output = [];

    /* inserisco i link dentro output */
    while (matches = reg.exec(htmlContent)) {
        output.push(matches[1].replaceAll("&amp;", "&"));
    }

    // Function to fetch video URL
    const fetchVideoUrl = async (url) => {
        try {
            const response = await fetch(baseUrl + url);
            const data = await response.text();
            const dlLink = data.match(/https:\/\/video\.polito\.it\/dl\/.*\.mp4/gi);

            if (dlLink) return dlLink[0]; 
        } 
        catch (error) {
        }

        return null;
    };

    // Fetch and display video URLs
    const urls = [];
    for (let [index, item] of output.entries()) {
        console.log(`${index + 1} - ${item}`);
        const videoUrl = await fetchVideoUrl(item);
        if (videoUrl) urls.push(videoUrl);
    }

    document.documentElement.innerHTML = `Found ${urls.length} videos. You can use the following with JDownloader: <br><br>`;
    document.documentElement.innerHTML += urls.join(",");
})()
