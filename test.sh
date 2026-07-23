#!/data/data/com.termux/files/usr/bin/bash

echo "==============================="
echo "      HMB BOT TEST TOOL"
echo "==============================="

echo ""
echo "[1] Node.js"
node -v

echo ""
echo "[2] PM2"
pm2 status

echo ""
echo "[3] Checking Files..."

files=(
index.js
welcome.js
welcomeCard.js
autorole.js
events/messageCreate.js
events/logs.js
events/antiRaid.js
commands/setlogs.js
badwords.json
warnings.json
raid.json
logs.json
)

for file in "${files[@]}"
do
if [ -f "$file" ]; then
echo "✅ $file"
else
echo "❌ $file"
fi
done

echo ""
echo "[4] JavaScript Syntax"

node --check index.js && echo "✅ index.js"

node --check events/messageCreate.js && echo "✅ messageCreate.js"

node --check events/logs.js && echo "✅ logs.js"

node --check events/antiRaid.js && echo "✅ antiRaid.js"

echo ""
echo "[5] Installed Packages"

npm list --depth=0

echo ""
echo "==============================="
echo "      TEST FINISHED"
echo "==============================="
