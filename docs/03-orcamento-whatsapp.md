# Orçamento e WhatsApp

O formulário está em `components/landing/quote-form.tsx`. A conta mora em `lib/quote.ts` e os preços em `lib/pricing.ts`. Os dois arquivos não usam banco nem rede: o teste de unidade chama as mesmas funções que a página.

## Preços de mão de obra

| Opção | Código | Valor |
| --- | --- | --- |
| Churrasco Completo | Opção 01 | R$ 1.500 |
| Churrasco Assador | Opção 02 | R$ 700 |
| Garçom, cada | opcional | R$ 150 |

O número de pessoas **não** entra na conta. Ele vai na mensagem para o Rudnei montar a lista de compras.

A mão de obra vale para até 50 pessoas (`LIMITS.includedPeople` em `lib/pricing.ts`). Acima disso, o total continua o mesmo, mas a mensagem diz que o valor vale para até 50 pessoas e pergunta "Como fica a taxa por pessoa acima de 50?".

Total = mão de obra da opção + (garçons × 150).

Garçons aceitos: inteiros de 0 a 20. Pessoas: inteiros de 1 a 500. Data: hoje ou futura, no fuso de São Paulo, no máximo dois anos à frente. Cidade: 2 a 60 caracteres, começando com letra.

## O que a mensagem deixa claro

O texto é o primeiro contato do cliente, curto e educado: "Olá, Rudnei! Vi seu site e gostaria de um orçamento.", depois a opção, as pessoas, a data por extenso, a cidade e os garçons ("não" quando é 0) em tópicos, o valor da mão de obra com o detalhe (ex.: "Churrasco Assador R$ 700,00 + 1 garçom R$ 150,00") e quatro dúvidas numeradas: valor total com ingredientes, lista de compras e pagamento, horário e duração, e disponibilidade da data. Acima de 50 pessoas entra a dúvida da taxa por pessoa.

O link é `https://wa.me/5514996272725?text=...`. O número também está em `lib/contact.ts`.

Enquanto o formulário está incompleto, o botão fica desligado e mostra “Preencha o orçamento”. Quando está válido, vira um link de verdade. Dá para copiar, abrir em outra aba e o teste lê o endereço sem precisar do aplicativo do WhatsApp.

O botão fixo e o do cabeçalho usam outra mensagem, curta, só para dizer que a pessoa veio pelo site. Ela está em `GENERAL_WHATSAPP_MESSAGE`.

## Nada é gravado

O envio não chama uma API do site. Não há planilha nem e-mail. O navegador só abre o WhatsApp.
