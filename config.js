/* Configuração do Contador de Folhas.
   Envio automático de emails com EmailJS — use os MESMOS valores do config.js da app PCV Ferramentas
   (bloco "emailjs"). Deixe vazio para envio manual (o operador envia o email com um clique).
   Em alternativa, pode copiar para aqui o config.js da PCV Ferramentas tal como está: a app também lê window.PCV_CONFIG. */
window.CF_CONFIG = {
  // Responsável que recebe os pedidos em todos os dispositivos (pode ser alterado no separador Pedidos de cada dispositivo)
  responsavel: { nome: 'David Malheiro', email: 'david.malheiro@graphicsleader.pt' },

  emailjs: {
    publicKey:  'rHK1AkbCr-1rYxskL',   // EmailJS › Account › Public Key
    serviceId:  'service_1kvimmm',   // EmailJS › Email Services › Service ID
    templateId: 'template_9maiezr'    // EmailJS › Email Templates › Template ID (Para = {{to_email}}, Assunto = {{subject}}, Corpo = {{message}})
  }
};
