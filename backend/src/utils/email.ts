import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = 'ZURT <noreply@zurt.com.br>';

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (resend) {
    const { error } = await resend.emails.send({ from: FROM, to: [to], subject, html, text: '' });
    if (error) throw new Error(`Resend error: ${error.message}`);
    return;
  }
  console.log('[Email] No provider configured. Subject:', subject, 'To:', to);
}

function base(content: string, badge: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;"><table width="100%" style="background:#000"><tr><td align="center"><table width="620" style="max-width:620px;width:100%"><tr><td style="height:48px"></td></tr><tr><td style="padding:0 44px"><table width="100%"><tr><td><span style="font-size:20px;font-weight:800;color:#FFF"><span style="color:#00D4AA">Z</span>URT</span></td><td align="right"><span style="display:inline-block;background:#0D2818;color:#00D4AA;font-size:11px;font-weight:600;padding:6px 14px;border-radius:100px">${badge}</span></td></tr></table></td></tr><tr><td style="height:56px"></td></tr>${content}<tr><td style="height:48px"></td></tr><tr><td style="padding:0 44px"><table width="100%"><tr><td style="height:1px;background:#111"></td></tr></table></td></tr><tr><td style="height:24px"></td></tr><tr><td align="center"><p style="margin:0;font-size:11px;color:#333;line-height:2">ZURT DAO LLC<br><a href="https://zurt.com.br" style="color:#00D4AA;text-decoration:none">zurt.com.br</a></p></td></tr><tr><td style="height:36px"></td></tr></table></td></tr></table></body></html>`;
}

function stepBlock(n: string, bg: string, c: string, title: string, desc: string): string {
  return `<tr><td style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:10px;padding:20px 24px"><table width="100%"><tr><td width="36" valign="top"><span style="display:inline-block;width:28px;height:28px;background:${bg};color:${c};font-size:13px;font-weight:700;text-align:center;line-height:28px;border-radius:50%">${n}</span></td><td style="padding-left:12px"><span style="font-size:15px;font-weight:600;color:#FFF">${title}</span><br><span style="font-size:13px;color:#555">${desc}</span></td></tr></table></td></tr>`;
}

export async function sendRegistrationOtp(to: string, code: string): Promise<void> {
  const subject = 'Código de verificação — ZURT';
  const html = base(`
<tr><td style="padding:0 44px"><h1 style="margin:0;font-size:48px;font-weight:800;color:#FFF;line-height:1.05;letter-spacing:-2px">Seu código<br><span style="background:linear-gradient(135deg,#00D4AA,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">de acesso.</span></h1></td></tr>
<tr><td style="height:20px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;font-size:16px;color:#666;line-height:1.7">Use o código abaixo para concluir seu cadastro no ZURT. Ele expira em <strong style="color:#FFF">10 minutos</strong>.</p></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%"><tr><td style="background:#0A0A0A;border:2px solid #00D4AA;border-radius:12px;padding:32px;text-align:center"><span style="font-size:48px;font-weight:800;letter-spacing:12px;color:#00D4AA">${code}</span></td></tr></table></td></tr>
<tr><td style="height:32px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;text-align:center;font-size:12px;color:#444">Se você não solicitou este código, ignore este email.</p></td></tr>
`, 'Verificação');
  try {
    await sendEmail(to, subject, html);
    console.log('[Email] OTP sent to', to);
  } catch (err) {
    console.error('[Email] Failed to send OTP:', err);
  }
}

export async function sendWelcomeEmail(to: string, name: string, plan = 'Básico'): Promise<void> {
  const subject = 'Você agora tem visão total do seu dinheiro — ZURT';
  const n = name.split(' ')[0];
  const fm: Record<string,string[]> = {
    'Básico': ['2 conexões bancárias','Dashboard básico','Relatórios mensais'],
    'Pro': ['10 conexões bancárias','Agent ilimitado','Relatórios ilimitados'],
    'Unlimited': ['Conexões ilimitadas','Agent ilimitado','Relatórios ilimitados'],
    'Enterprise': ['Tudo do Unlimited','Multi-assessor','Suporte prioritário'],
  };
  const feats = fm[plan] ?? fm['Básico'];
  const html = base(`
<tr><td style="padding:0 44px"><h1 style="margin:0;font-size:52px;font-weight:800;color:#FFF;line-height:1.05;letter-spacing:-2px">Você agora tem<br><span style="background:linear-gradient(135deg,#00D4AA,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">visão total</span> do<br>seu dinheiro.</h1></td></tr>
<tr><td style="height:20px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;font-size:16px;color:#666;line-height:1.7">${n}, a maioria das pessoas não sabe quanto tem. Nem onde está. Nem se está rendendo o que deveria. Você acabou de resolver isso.</p></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%" style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:12px"><tr><td style="padding:28px 32px"><span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:1px">Plano ativo</span><br><span style="font-size:24px;font-weight:700;color:#FFF">${plan}</span></td></tr><tr><td style="height:1px;background:#1A1A1A"></td></tr><tr><td style="padding:20px 32px"><table width="100%"><tr>${feats.map(f => `<td style="font-size:13px;color:#3B82F6">&#10003; ${f}</td>`).join('')}</tr></table></td></tr></table></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%"><tr><td style="background:linear-gradient(135deg,#00D4AA,#00B894);padding:18px 0;border-radius:10px;text-align:center"><a href="https://zurt.com.br" style="font-size:15px;font-weight:700;color:#000;text-decoration:none">Começar agora →</a></td></tr></table></td></tr>
<tr><td style="height:56px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0 0 20px;font-size:12px;color:#444;text-transform:uppercase;letter-spacing:2px;font-weight:600">3 minutos para configurar tudo</p></td></tr>
<tr><td style="padding:0 44px"><table width="100%">
${stepBlock('1','#0D2818','#00D4AA','Conecte seus bancos','Via Open Finance. Seguro, regulado pelo Banco Central, leva 2 minutos.')}
<tr><td style="height:8px"></td></tr>
${stepBlock('2','#0A1628','#3B82F6','Vincule a B3','Ações, FIIs, renda fixa — tudo atualizado automaticamente.')}
<tr><td style="height:8px"></td></tr>
${stepBlock('3','#1A0D28','#A855F7','Pergunte ao ZURT Agent','"Quanto rendeu minha carteira?" — ele sabe. Em português, sem complicação.')}
</table></td></tr>
<tr><td style="height:56px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%"><tr><td style="border-left:2px solid #1A1A1A;padding-left:20px"><p style="margin:0;font-size:14px;color:#444;line-height:1.7;font-style:italic">"A gente criou o ZURT porque acredita que todo investidor merece enxergar o próprio patrimônio com a mesma clareza que um family office oferece."</p><p style="margin:10px 0 0;font-size:12px;color:#333">— Time ZURT</p></td></tr></table></td></tr>
`, 'Conta ativa');
  try {
    await sendEmail(to, subject, html);
    console.log('[Email] Welcome sent to', to);
  } catch (err) {
    console.error('[Email] Failed to send welcome:', err);
  }
}

export async function sendPasswordResetCode(to: string, code: string, name: string): Promise<void> {
  const subject = 'Redefinição de senha — ZURT';
  const n = name.split(' ')[0];
  const html = base(`
<tr><td style="padding:0 44px"><h1 style="margin:0;font-size:48px;font-weight:800;color:#FFF;line-height:1.05;letter-spacing:-2px">Redefinir<br><span style="background:linear-gradient(135deg,#3B82F6,#A855F7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">sua senha.</span></h1></td></tr>
<tr><td style="height:20px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;font-size:16px;color:#666;line-height:1.7">${n}, use o código abaixo para redefinir sua senha. Se não foi você, ignore este email.</p></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%"><tr><td style="background:#0A0A0A;border:2px solid #3B82F6;border-radius:12px;padding:32px;text-align:center"><span style="font-size:48px;font-weight:800;letter-spacing:12px;color:#3B82F6">${code}</span></td></tr></table></td></tr>
<tr><td style="height:24px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%" style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:10px"><tr><td style="padding:20px 24px"><table width="100%"><tr><td width="32" valign="top"><span style="display:inline-block;width:28px;height:28px;background:#1A0D28;color:#A855F7;font-size:16px;font-weight:700;text-align:center;line-height:28px;border-radius:50%">!</span></td><td style="padding-left:12px"><span style="font-size:14px;font-weight:600;color:#FFF">Este código expira em 15 minutos</span><br><span style="font-size:13px;color:#555">Após esse prazo, solicite um novo código.</span></td></tr></table></td></tr></table></td></tr>
`, 'Segurança da conta');
  try {
    await sendEmail(to, subject, html);
    console.log('[Email] Password reset sent to', to);
  } catch (err) {
    console.error('[Email] Failed to send password reset:', err);
  }
}

export async function sendPlanConfirmationEmail(to: string, name: string, plan: string, price: string, renewalDate: string, features: string[]): Promise<void> {
  const subject = `Plano ${plan} ativado com sucesso — ZURT`;
  const n = name.split(' ')[0];
  const html = base(`
<tr><td style="padding:0 44px"><h1 style="margin:0;font-size:48px;font-weight:800;color:#FFF;line-height:1.05;letter-spacing:-2px">Plano <span style="background:linear-gradient(135deg,#00D4AA,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${plan}</span><br>ativado.</h1></td></tr>
<tr><td style="height:20px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;font-size:16px;color:#666;line-height:1.7">${n}, seu pagamento foi confirmado. Você já tem acesso completo ao plano ${plan}.</p></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%" style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:12px"><tr><td style="padding:28px 32px"><table width="100%"><tr><td><span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:1px">Plano contratado</span><br><span style="font-size:24px;font-weight:700;color:#FFF">${plan}</span></td><td align="right" valign="bottom"><span style="font-size:28px;font-weight:800;color:#00D4AA">${price}</span><span style="font-size:12px;color:#555">/mês</span></td></tr></table></td></tr><tr><td style="height:1px;background:#1A1A1A"></td></tr><tr><td style="padding:20px 32px"><table width="100%">${features.map(f => `<tr><td style="padding:6px 0;font-size:13px;color:#3B82F6">&#10003; ${f}</td></tr>`).join('')}</table></td></tr><tr><td style="height:1px;background:#1A1A1A"></td></tr><tr><td style="padding:16px 32px"><span style="font-size:12px;color:#444">Próxima renovação: </span><span style="font-size:12px;color:#FFF;font-weight:600">${renewalDate}</span></td></tr></table></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%"><tr><td style="background:linear-gradient(135deg,#00D4AA,#00B894);padding:18px 0;border-radius:10px;text-align:center"><a href="https://zurt.com.br" style="font-size:15px;font-weight:700;color:#000;text-decoration:none">Acessar minha conta →</a></td></tr></table></td></tr>
<tr><td style="height:48px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;font-size:12px;color:#333">Dúvidas? <a href="mailto:suporte@zurt.com.br" style="color:#00D4AA;text-decoration:none">suporte@zurt.com.br</a></p></td></tr>
`, 'Pagamento confirmado');
  try {
    await sendEmail(to, subject, html);
    console.log('[Email] Plan confirmation sent to', to);
  } catch (err) {
    console.error('[Email] Failed to send plan confirmation:', err);
  }
}

export async function sendFamilyInviteEmail(to: string, inviteeName: string, adminName: string, groupName: string, role: string, inviteUrl: string, expiresAt = '7 dias'): Promise<void> {
  const subject = `${adminName} te convidou para o Grupo Familiar — ZURT`;
  const n = inviteeName.split(' ')[0];
  const html = base(`
<tr><td style="padding:0 44px"><h1 style="margin:0;font-size:44px;font-weight:800;color:#FFF;line-height:1.1;letter-spacing:-2px">Você foi convidado<br>para o <span style="background:linear-gradient(135deg,#00D4AA,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Grupo<br>Familiar.</span></h1></td></tr>
<tr><td style="height:20px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;font-size:16px;color:#666;line-height:1.7">${n}, <strong style="color:#FFF">${adminName}</strong> convidou você para o grupo <strong style="color:#FFF">${groupName}</strong> na ZURT.</p></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%" style="background:#0A0A0A;border:1px solid #1A1A1A;border-radius:12px"><tr><td style="padding:28px 32px"><table width="100%"><tr><td><span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:1px">Grupo familiar</span><br><span style="font-size:22px;font-weight:700;color:#FFF">${groupName}</span></td><td align="right" valign="top"><span style="display:inline-block;background:#0D1F2D;color:#3B82F6;font-size:11px;font-weight:600;padding:6px 14px;border-radius:100px">${role}</span></td></tr></table></td></tr><tr><td style="height:1px;background:#1A1A1A"></td></tr><tr><td style="padding:20px 32px"><table width="100%"><tr><td style="padding:6px 0;font-size:13px;color:#3B82F6">&#10003; Visualizar patrimônio consolidado do grupo</td></tr><tr><td style="padding:6px 0;font-size:13px;color:#3B82F6">&#10003; Acesso configurado pelo administrador</td></tr><tr><td style="padding:6px 0;font-size:13px;color:#3B82F6">&#10003; Seus dados permanecem privados e sob seu controle</td></tr></table></td></tr></table></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><table width="100%"><tr><td style="background:linear-gradient(135deg,#00D4AA,#00B894);padding:18px 0;border-radius:10px;text-align:center"><a href="${inviteUrl}" style="font-size:15px;font-weight:700;color:#000;text-decoration:none">Aceitar convite →</a></td></tr></table></td></tr>
<tr><td style="height:16px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0;text-align:center;font-size:12px;color:#444">Este convite expira em <strong style="color:#FFF">${expiresAt}</strong></p></td></tr>
<tr><td style="height:40px"></td></tr>
<tr><td style="padding:0 44px"><p style="margin:0 0 8px;font-size:12px;color:#444">Se o botão não funcionar, copie e cole no navegador:</p><p style="margin:0;font-size:11px;color:#555;word-break:break-all;font-family:monospace">${inviteUrl}</p></td></tr>
`, 'Convite recebido');
  try {
    await sendEmail(to, subject, html);
    console.log('[Email] Family invite sent to', to);
  } catch (err) {
    console.error('[Email] Failed to send family invite:', err);
  }
}
