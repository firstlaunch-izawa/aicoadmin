@echo off
echo Setting up Windows Firewall rules...

:: アプリケーションの受信ルールを追加
netsh advfirewall firewall add rule name="Aico Admin (HTTP)" dir=in action=allow protocol=TCP localport=3000

:: アプリケーションの送信ルールを追加
netsh advfirewall firewall add rule name="Aico Admin (HTTP)" dir=out action=allow protocol=TCP localport=3000

echo Firewall rules have been set up successfully!