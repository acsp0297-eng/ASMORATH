
        // --- 1. Calculator Logic ---
        const campaignType = document.getElementById('campaignType');
        const duration = document.getElementById('duration');
        const durationValue = document.getElementById('durationValue');
        const addonRush = document.getElementById('addonRush');
        const addonCreative = document.getElementById('addonCreative');
        const totalPriceEl = document.getElementById('totalPrice');

        function calculateTotal() {
            let base = parseInt(campaignType.value);
            let multiplier = parseInt(duration.value);
            let rush = addonRush.checked ? 200 : 0;
            let creative = addonCreative.checked ? 350 : 0;
            let total = (base * multiplier) + rush + creative;
            
            totalPriceEl.textContent = '$' + total.toLocaleString();
            durationValue.textContent = multiplier;
        }

        [campaignType, duration, addonRush, addonCreative].forEach(el => {
            el.addEventListener('input', calculateTotal);
        });
        calculateTotal();

        // --- 2. Copy Email Logic ---
        function copyEmail() {
            navigator.clipboard.writeText('asmorath@gmail.com').then(() => {
                const feedback = document.getElementById('copyFeedback');
                const btn = document.getElementById('copyBtn');
                const originalText = btn.innerText;
                
                feedback.style.opacity = '1';
                btn.innerText = "COPIED!";
                btn.style.backgroundColor = '#121212';
                
                setTimeout(() => {
                    feedback.style.opacity = '0';
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            });
        }

        // --- 3. Dynamic Stream Chat Logic ---
        const chatBox = document.getElementById('chatBox');
        const usernames = ['CoolGamer99', 'SniperWolf', 'CardShark', 'TexasHoldem', 'ViewerOne', 'ModBot', 'HighRoller'];
        const messages = ['Nice shot!', 'What game is this?', 'Can you show the leaderboard?', 'Huge win on red!', 'Subscribed!', 'GG', 'PogChamp', 'Lets gooooo'];
        const colors = ['text-pink-400', 'text-blue-400', 'text-yellow-400', 'text-green-400'];

        function addChatMessage() {
            const user = usernames[Math.floor(Math.random() * usernames.length)];
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const div = document.createElement('div');
            div.className = 'chat-message';
            div.innerHTML = `<span class="font-bold ${color}">${user}:</span> ${msg}`;
            
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;

            if(chatBox.children.length > 20) chatBox.removeChild(chatBox.firstChild);
        }
        setInterval(addChatMessage, 2500);

        // --- 4. Live Viewer Counter Logic ---
        const viewerEl = document.getElementById('viewerCount');
        let viewers = 1240;
        setInterval(() => {
            const change = Math.floor(Math.random() * 21) - 10;
            viewers += change;
            viewerEl.textContent = viewers.toLocaleString();
        }, 1000);

        // --- 5. Dynamic Leaderboard Logic ---
        const lbBody = document.getElementById('leaderboardBody');
        const games = ['Sweet Bonanza', 'Gates of Olympus', 'Wanted Dead', 'Sugar Rush', 'Plinko'];
        const initialWins = [
            {u: 'J***9', g: 'Gates of Olympus', m: '500x', w: '$5,000'},
            {u: 'K***2', g: 'Plinko', m: '1000x', w: '$2,500'},
            {u: 'M***X', g: 'Sugar Rush', m: '150x', w: '$800'},
        ];

        function renderRow(win, animate = false) {
            const tr = document.createElement('tr');
            if(animate) tr.className = 'new-row bg-yellow-100';
            tr.className += ' border-b border-gray-200 hover:bg-gray-50';
            tr.innerHTML = `
                <td class="p-4 font-bold">${win.u}</td>
                <td class="p-4 font-mono text-gray-600">${win.g}</td>
                <td class="p-4 text-right font-bold text-pink-600">${win.m}</td>
                <td class="p-4 text-right font-black">${win.w}</td>
            `;
            return tr;
        }

        initialWins.forEach(win => lbBody.appendChild(renderRow(win)));

        function addBigWin() {
            const newUser = 'User' + Math.floor(Math.random() * 999);
            const game = games[Math.floor(Math.random() * games.length)];
            const mult = Math.floor(Math.random() * 900) + 50;
            const win = Math.floor(Math.random() * 5000) + 100;
            
            const row = renderRow({
                u: newUser, 
                g: game, 
                m: mult + 'x', 
                w: '$' + win.toLocaleString()
            }, true);
            
            lbBody.insertBefore(row, lbBody.firstChild);
            if(lbBody.children.length > 5) lbBody.removeChild(lbBody.lastChild);
        }
        setInterval(addBigWin, 4000);

        // --- 6. EXPORT PROJECT FUNCTIONALITY ---
        function exportProject() {
            const zip = new JSZip();
            
            // Get Content
            const cssContent = document.getElementById('main-css').innerText;
            const jsContent = document.getElementById('main-js').innerText;
            
            // Create Clean HTML (Removing inline styles/scripts and adding links)
            let htmlContent = document.documentElement.outerHTML;
            
            // 1. Remove the export script itself (optional, but cleaner)
            // 2. Replace inline CSS with link
            htmlContent = htmlContent.replace(/<style id="main-css">[\s\S]*?<\/style>/, '<link rel="stylesheet" href="style.css">');
            
            // 3. Replace inline JS with script tag
            htmlContent = htmlContent.replace(/<script id="main-js">[\s\S]*?<\/script>/, '<script src="script.js"><\/script>');
            
            // 4. Remove the export button from the saved HTML so the production version doesn't have it
            const exportButtonRegex = /<button onclick="exportProject\(\)"[\s\S]*?<\/button>/;
            htmlContent = htmlContent.replace(exportButtonRegex, '');

            // Add files to ZIP
            zip.file("index.html", "<!DOCTYPE html>\n" + htmlContent);
            zip.file("style.css", cssContent);
            zip.file("script.js", jsContent);
            
            // Generate and Save
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "media-kit-project.zip");
            });
        }
    