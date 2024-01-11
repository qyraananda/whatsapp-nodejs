const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
	// console.log('QR RECEIVED', qr);
	qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

// client.initialize();

client.initialize();

const api = async (req, res) => {
	
	let noHP = req.query.noHP || req.body.noHP;
	const pesan = req.query.pesan || req.body.pesan;
	const wagroup = req.body.wagroup;
	
	if (noHP.startsWith("0")) {
			noHP = "62" + noHP.slice(1) + "@c.us";
		} else if (noHP.startsWith("62")) {
			noHP = noHP + "@c.us";
		} else {
			noHP = "62" + noHP + "@c.us";
	}
	
	try {
		console.log(wagroup);
		if (typeof wagroup !== 'undefined') {
			let chats = await client.getChats();
			const chat = chats.find(
				(chat) => chat.name === "IT Squad"
			);
			if (chat.isGroup) {
				chat.participants.forEach(function (item) {
					let contacto = JSON.stringify(item.id._serialized);
					let cont = contacto.replace('"', "");
					// console.log(cont.replace('"', ""));
					const userGroup =  client.isRegisteredUser(cont.replace('"', ""));
			
					if (userGroup) { 
						// client.sendMessage(cont,pesan);
						res.json({status:200,"Message": 'User Registered'});
					} else {
						res.json({status:404,"Message": 'User Not Registered'});
					}
				});

			}
		} else {
			// console.log("noHP: " + noHP);
			const user = await client.isRegisteredUser(noHP);
			
			if (user) { 
				// client.sendMessage(noHP,pesan);
				res.json({status:200,"Message": 'User Registered'});
			} else {
				res.json({status:404,"Message": 'User Not Registered'});
			}
		}
		
	} catch (error) {
		res.status(500).json({status: 'Error', error: error.message});
	}
	
	return new Promise(resolve => setTimeout(resolve, 10000));

}



module.exports = api