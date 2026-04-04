// resend disabled
const resend: any = { emails: { send: async () => ({ data: null, error: "disabled" }) } };
// const resend: any = { emails: { send: async () => ({ data: null, error: "resend disabled" }) } }; // removed - using nodemailer
const FROM = process.env.EMAIL_FROM || 'ZURT <onboarding@resend.dev>';

const P: any = {
  basic: { n:'B\u00e1sico',c:'#8B95A5',g:'#3A4A5E',f:['2 conex\u00f5es banc\u00e1rias','10 consultas IA/dia','3 relat\u00f3rios/m\u00eas'] },
  pro: { n:'PRO',c:'#00D4AA',g:'#0D2818',f:['5 conex\u00f5es banc\u00e1rias','25 consultas IA/dia','Export CSV/Excel'] },
  unlimited: { n:'Unlimited',c:'#3B82F6',g:'#0A1628',f:['Conex\u00f5es ilimitadas','Agent ilimitado','Relat\u00f3rios ilimitados'] },
  enterprise: { n:'Enterprise',c:'#F59E0B',g:'#1A1408',f:['Tudo Unlimited','Consultor dedicado','Suporte VIP'] },
  banker: { n:'Banker',c:'#A855F7',g:'#1A0D28',f:['\u00c1rea do cliente','Gest\u00e3o de clientes','White-label'] },
};

function welcome(name: string, plan: string, billing: string, price: string): string {
  const p = P[plan] || P.basic;
  const bl = billing === 'annual' ? 'Anual' : 'M\u00eas';
  const checks = p.f.map((f: string) => '<td style="font-size:13px;color:' + p.c + '">&#10003; ' + f + '</td>').join('');
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" style="background:#000"><tr><td align="center"><table width="620" style="max-width:620px;width:100%">

<tr><td style="height:48px"></td></tr>

<tr><td style="padding:0 44px"><table width="100%"><tr>
<td><span style="font-size:20px;font-weight:800;color:#FFF;letter-spacing:-0.5px"><span style="color:#00D4AA">Z</span>URT</span></td>
<td align="right"><span style="display:inline-block;background:#0D2818;color:#00D4AA;font-size:11px;font-weight:600;padding:6px 14px;border-radius:100px">Conta ativa</span></td>
</tr></table></td></tr>

<tr><td style="height:56px"></td></tr>

<tr><td style="padding:0 44px">
<h1 style="margin:0;font-size:52px;font-weight:800;color:#FFF;line-height:1.05;letter-spacing:-2px">
Voc\u00ea agora tem<br><span style="background:linear-gradient(135deg,#00D4AA,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">vis\u00e3o total</span> do<br>seu dinheiro.</h1>
</td></tr>

<tr><td style="height:20px"></td></tr>

<tr><td style="padding:0 44px">
<p style="margin:0;font-size:16px;color:#666;line-height:1.7;max-width:420px">
${name}, a maioria das pessoas n\u00e3o sabe quanto tem. Nem onde est\u00e1. Nem se est\u00e1 rendendo o que deveria. Voc\u00ea acabou de resolver isso.</p>
</td></tr>

<tr><td style="height:40px"></td></tr>

<tr><td style="padding:0 44px">
<table width="100%" style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:12px">
<tr><td style="padding:28px 32px"><table width="100%"><tr>
<td><span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:1px">Plano ativo</span><br>
<span style="font-size:24px;font-weight:700;color:#FFF;letter-spacing:-0.5px">${p.n}</span></td>
<td align="right" valign="bottom"><span style="font-size:28px;font-weight:800;color:#FFF">${price}</span>
<span style="font-size:12px;color:#555">/${bl}</span></td>
</tr></table></td></tr>
<tr><td style="height:1px;background:#1A1A1A"></td></tr>
<tr><td style="padding:20px 32px"><table width="100%"><tr>${checks}</tr></table></td></tr>
</table></td></tr>

<tr><td style="height:40px"></td></tr>

<tr><td style="padding:0 44px"><table width="100%"><tr>
<td style="background:linear-gradient(135deg,#00D4AA,#00B894);padding:18px 0;border-radius:10px;text-align:center">
<a href="https://zurt.com.br" style="font-size:15px;font-weight:700;color:#000;text-decoration:none">Come\u00e7ar agora \u2192</a>
</td></tr></table></td></tr>

<tr><td style="height:56px"></td></tr>

<tr><td style="padding:0 44px">
<p style="margin:0 0 20px;font-size:12px;color:#444;text-transform:uppercase;letter-spacing:2px;font-weight:600">3 minutos para configurar tudo</p>
</td></tr>

<tr><td style="padding:0 44px"><table width="100%">
<tr><td style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:10px;padding:20px 24px"><table width="100%"><tr>
<td width="36" valign="top"><span style="display:inline-block;width:28px;height:28px;background:#0D2818;color:#00D4AA;font-size:13px;font-weight:700;text-align:center;line-height:28px;border-radius:50%">1</span></td>
<td style="padding-left:12px"><span style="font-size:15px;font-weight:600;color:#FFF">Conecte seus bancos</span><br>
<span style="font-size:13px;color:#555">Via Open Finance. Seguro, regulado pelo Banco Central, leva 2 minutos.</span></td>
</tr></table></td></tr>
<tr><td style="height:8px"></td></tr>
<tr><td style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:10px;padding:20px 24px"><table width="100%"><tr>
<td width="36" valign="top"><span style="display:inline-block;width:28px;height:28px;background:#0A1628;color:#3B82F6;font-size:13px;font-weight:700;text-align:center;line-height:28px;border-radius:50%">2</span></td>
<td style="padding-left:12px"><span style="font-size:15px;font-weight:600;color:#FFF">Vincule a B3</span><br>
<span style="font-size:13px;color:#555">A\u00e7\u00f5es, FIIs, renda fixa \u2014 tudo atualizado automaticamente.</span></td>
</tr></table></td></tr>
<tr><td style="height:8px"></td></tr>
<tr><td style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:10px;padding:20px 24px"><table width="100%"><tr>
<td width="36" valign="top"><span style="display:inline-block;width:28px;height:28px;background:#1A0D28;color:#A855F7;font-size:13px;font-weight:700;text-align:center;line-height:28px;border-radius:50%">3</span></td>
<td style="padding-left:12px"><span style="font-size:15px;font-weight:600;color:#FFF">Pergunte ao ZURT Agent</span><br>
<span style="font-size:13px;color:#555">"Quanto rendeu minha carteira?" \u2014 ele sabe. Em portugu\u00eas, sem complica\u00e7\u00e3o.</span></td>
</tr></table></td></tr>
</table></td></tr>

<tr><td style="height:56px"></td></tr>

<tr><td style="padding:0 44px"><table width="100%"><tr><td style="border-left:2px solid #1A1A1A;padding-left:20px">
<p style="margin:0;font-size:14px;color:#444;line-height:1.7;font-style:italic">
"A gente criou o ZURT porque acredita que todo investidor merece enxergar o pr\u00f3prio patrim\u00f4nio com a mesma clareza que um family office oferece."</p>
<p style="margin:10px 0 0;font-size:12px;color:#333">\u2014 Time ZURT</p>
</td></tr></table></td></tr>

<tr><td style="height:48px"></td></tr>

<tr><td style="padding:0 44px"><table width="100%"><tr><td style="height:1px;background:#111"></td></tr></table></td></tr>
<tr><td style="height:24px"></td></tr>
<tr><td align="center"><p style="margin:0;font-size:11px;color:#333;line-height:2">ZURT DAO LLC<br>
<a href="https://zurt.com.br" style="color:#00D4AA;text-decoration:none">zurt.com.br</a></p></td></tr>
<tr><td style="height:36px"></td></tr>

</table></td></tr></table></body></html>`;
}

function payment(name: string, plan: string, billing: string, amount: string): string {
  const p = P[plan] || P.basic;
  const bl = billing === 'annual' ? 'Anual' : 'M\u00eas';
  const today = new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'});
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
<table width="100%" style="background:#000"><tr><td align="center"><table width="620" style="max-width:620px;width:100%">
<tr><td style="height:48px"></td></tr>
<tr><td style="padding:0 44px"><span style="font-size:20px;font-weight:800;color:#FFF"><span style="color:#00D4AA">Z</span>URT</span></td></tr>
<tr><td style="height:48px"></td></tr>
<tr><td style="padding:0 44px"><h1 style="margin:0;font-size:36px;font-weight:800;color:#FFF;letter-spacing:-1px">Pagamento confirmado.</h1></td></tr>
<tr><td style="height:16px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;font-size:16px;color:#666;line-height:1.7">${name}, seu pagamento foi processado com sucesso. Abaixo est\u00e3o os detalhes.</p></td></tr>
<tr><td style="height:36px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%" style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:12px">
<tr><td style="padding:24px 28px;border-bottom:1px solid #1A1A1A"><span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:1px">Plano</span><br><span style="font-size:18px;font-weight:700;color:${p.c}">${p.n} \u00b7 ${bl}</span></td></tr>
<tr><td style="padding:24px 28px;border-bottom:1px solid #1A1A1A"><span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:1px">Valor</span><br><span style="font-size:26px;font-weight:800;color:#FFF">${amount}</span></td></tr>
<tr><td style="padding:24px 28px;border-bottom:1px solid #1A1A1A"><span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:1px">Data</span><br><span style="font-size:15px;color:#FFF">${today}</span></td></tr>
<tr><td style="padding:24px 28px"><span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:1px">Status</span><br><span style="display:inline-block;background:#0D2818;color:#00D4AA;font-size:13px;font-weight:600;padding:4px 14px;border-radius:100px;margin-top:6px">Ativo</span></td></tr>
</table></td></tr>
<tr><td style="height:36px"></td></tr>
<tr><td align="center"><p style="font-size:13px;color:#555">Gerencie sua assinatura pelo <a href="https://zurt.com.br" style="color:#00D4AA;text-decoration:none">app</a>.</p></td></tr>
<tr><td style="height:48px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%"><tr><td style="height:1px;background:#111"></td></tr></table></td></tr>
<tr><td style="height:24px"></td></tr>
<tr><td align="center"><p style="font-size:11px;color:#333;line-height:2">ZURT DAO LLC<br><a href="https://zurt.com.br" style="color:#00D4AA;text-decoration:none">zurt.com.br</a></p></td></tr>
<tr><td style="height:36px"></td></tr>
</table></td></tr></table></body></html>`;
}

export async function sendWelcomeEmail(email: string, name: string, plan: string, billing: string = 'monthly', price: string = '') {
  const p = P[plan] || P.basic;
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to: [email], subject: 'Bem-vindo ao ZURT ' + p.n + ' \u2014 sua conta est\u00e1 ativa', html: welcome(name || 'Investidor', plan, billing, price) });
    if (error) { console.error('[EMAIL] Welcome error:', error); return null; }
    console.log('[EMAIL] Welcome sent to', email, 'ID:', data?.id);
    return data;
  } catch (e: any) { console.error('[EMAIL] Welcome failed:', e?.message); return null; }
}

export async function sendPaymentConfirmation(email: string, name: string, plan: string, billing: string, cents: number) {
  const amt = 'R$ ' + (cents/100).toFixed(2).replace('.',',');
  const p = P[plan] || P.basic;
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to: [email], subject: 'Pagamento confirmado \u2014 ZURT ' + p.n, html: payment(name || 'Investidor', plan, billing, amt) });
    if (error) { console.error('[EMAIL] Payment error:', error); return null; }
    console.log('[EMAIL] Payment sent to', email, 'ID:', data?.id);
    return data;
  } catch (e: any) { console.error('[EMAIL] Payment failed:', e?.message); return null; }
}