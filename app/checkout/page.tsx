'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  ShoppingBag,
  Smartphone,
  Copy,
  Check,
  Clock,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { Order, PaymentMethod } from '@/types';

function generateOrderId(): string {
  return `BF-${Math.floor(1000 + Math.random() * 9000)}`;
}

function getOrderTimestamp(): number {
  return Date.now();
}

export default function CheckoutPage() {
  const { cart, clearCart, user, addOrder, selectedStore } = useStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone?.replace('+244 ', '') || '');
  const [address, setAddress] = useState(user?.addresses?.[0]?.address || '');
  const [reference, setReference] = useState(user?.addresses?.[0]?.reference || '');

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Multicaixa Express');
  const [mcxPhone, setMcxPhone] = useState(phone || '');
  const [paymentResult, setPaymentResult] = useState<{
    entity?: string;
    reference?: string;
    expiryDate?: string;
    message?: string;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [lastCreatedOrderNumber, setLastCreatedOrderNumber] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;

  const handleNext = () => setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
  const handleBack = () => setStep((s) => (s - 1) as 1 | 2 | 3 | 4);

  const handleCheckout = async () => {
    setIsProcessing(true);
    const orderId = generateOrderId();
    setLastCreatedOrderNumber(orderId);

    try {
      if (selectedMethod === 'Multicaixa Express' || selectedMethod === 'Referência Multicaixa') {
        const res = await fetch('/api/payments/appypay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId,
            method: selectedMethod === 'Multicaixa Express' ? 'MULTICAIXA_EXPRESS' : 'REFERENCIA_MULTICAIXA',
            customerPhone: mcxPhone,
            customerName: name,
            customerEmail: user?.email,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setPaymentResult({
            entity: data.reference?.entity || '00112',
            reference: data.reference?.reference || '',
            expiryDate: data.reference?.expiryDate,
            message: data.message,
          });
        }
      }

      const orderTimestamp = getOrderTimestamp();
      const newOrder: Order = {
        id: `ord_${orderTimestamp}`,
        orderNumber: `#${orderId}`,
        userId: user?.id || 'usr_faminto_guest',
        items: [...cart],
        subtotal,
        deliveryFee,
        discount: 0,
        total,
        status: 'Processando',
        paymentMethod: selectedMethod,
        paymentDetails: paymentResult
          ? {
              entity: paymentResult.entity,
              reference: paymentResult.reference,
              phone: mcxPhone,
            }
          : undefined,
        deliveryAddress: {
          name,
          phone,
          address,
          reference,
        },
        createdAt: orderTimestamp,
      };

      addOrder(newOrder);

      setTimeout(() => {
        setIsProcessing(false);
        setStep(4);
        clearCart();
      }, 1000);
    } catch (err) {
      console.error('Payment checkout error:', err);
      setIsProcessing(false);
      setStep(4);
      clearCart();
    }
  };

  const copyRefToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <ShoppingBag className="w-16 h-16 opacity-20 mb-4" />
        <h2 className="font-display text-3xl font-bold uppercase mb-2">Carrinho Vazio</h2>
        <p className="text-[var(--text-secondary)] mb-6">A tua fome está a reclamar. Volta ao menu.</p>
        <Button asChild>
          <Link href="/menu">IR PARA O MENU</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        {step !== 4 && (
          <div className="flex items-center justify-between mb-10 relative max-w-lg mx-auto">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-[var(--border-color)] -z-10" />

            {[
              { num: 1, label: 'PEDIDO' },
              { num: 2, label: 'ENTREGA' },
              { num: 3, label: 'PAGAMENTO' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-2 bg-[var(--bg-primary)] px-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step >= s.num
                      ? 'bg-[var(--accent-primary)] text-white shadow-md'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    step >= s.num ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-6 md:p-10 shadow-xl">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <h2 className="font-display text-2xl font-bold uppercase">Confirma o Pedido</h2>
                <span className="text-xs text-[var(--accent-primary)] font-bold uppercase bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border-color)]">
                  Loja: {selectedStore?.neighborhood || 'Maianga'}
                </span>
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-color)]"
                  >
                    <div>
                      <h4 className="font-bold uppercase text-sm">
                        {item.quantity}x {item.product.name}
                      </h4>
                      {item.extras && item.extras.length > 0 && (
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          + {item.extras.map((e) => e.name).join(', ')}
                        </p>
                      )}
                      {item.customizations && (
                        <p className="text-[11px] text-[var(--accent-primary)] mt-0.5">
                          {[item.customizations.bread, item.customizations.meat, item.customizations.cheese]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      )}
                    </div>
                    <span className="font-bold font-display text-base text-[var(--text-primary)]">
                      {item.totalPrice.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2 border-t border-[var(--border-color)] text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString('pt-AO')} Kz</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Taxa de Entrega (Luanda)</span>
                  <span>{deliveryFee.toLocaleString('pt-AO')} Kz</span>
                </div>
                <div className="flex justify-between font-display text-2xl font-bold pt-4 text-[var(--accent-primary)]">
                  <span>Total</span>
                  <span>{total.toLocaleString('pt-AO')} Kz</span>
                </div>
              </div>

              <Button size="lg" className="w-full mt-6 py-4 rounded-xl uppercase font-bold" onClick={handleNext}>
                Continuar para Morada de Entrega
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="font-display text-2xl font-bold uppercase border-b border-[var(--border-color)] pb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[var(--accent-primary)]" /> Morada de Entrega em Luanda
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">Nome de Quem Recebe</label>
                  <input
                    type="text"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">Telemóvel para Notificação</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-[var(--text-secondary)]">+244</span>
                    <input
                      type="tel"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 pl-14 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">Endereço Completo</label>
                  <input
                    type="text"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Bairro, Rua, Edifício, Casa nº..."
                    required
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">Ponto de Referência (Opcional)</label>
                  <input
                    type="text"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex: Próximo à bomba da Sonangol, portão preto..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" size="lg" className="flex-1 rounded-xl font-bold uppercase" onClick={handleBack}>
                  Voltar
                </Button>
                <Button size="lg" className="flex-1 rounded-xl font-bold uppercase" onClick={handleNext}>
                  Ir para Pagamento
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
                <h2 className="font-display text-2xl font-bold uppercase flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-[var(--accent-primary)]" /> Pagamento Seguro em Kwanzas
                </h2>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1">
                  ⚡ Pagamento Digital 100% Protegido
                </span>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setSelectedMethod('Multicaixa Express')}
                  className={`flex flex-col p-4 border rounded-2xl cursor-pointer transition-all ${
                    selectedMethod === 'Multicaixa Express'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 ring-1 ring-[var(--accent-primary)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[var(--accent-primary)] text-white">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm uppercase">Multicaixa Express (Débito Móvel)</span>
                          <span className="bg-[var(--accent-primary)] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            Recomendado
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                          Notificação instantânea para o teu telemóvel para aprovar com o PIN
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedMethod === 'Multicaixa Express'}
                      onChange={() => setSelectedMethod('Multicaixa Express')}
                      className="w-5 h-5 accent-[var(--accent-primary)]"
                    />
                  </div>

                  {selectedMethod === 'Multicaixa Express' && (
                    <div className="mt-4 pt-4 border-t border-[var(--border-color)]/60 space-y-2">
                      <label className="text-xs font-bold uppercase text-[var(--text-secondary)]">
                        Número de Telefone Associado ao Multicaixa Express:
                      </label>
                      <div className="relative flex items-center max-w-sm">
                        <span className="absolute left-3 text-xs font-bold text-[var(--text-secondary)]">+244</span>
                        <input
                          type="tel"
                          value={mcxPhone}
                          onChange={(e) => setMcxPhone(e.target.value)}
                          placeholder="923 000 000"
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-2.5 pl-14 text-sm font-bold focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>
                    </div>
                  )}
                </label>

                <label
                  onClick={() => setSelectedMethod('Referência Multicaixa')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                    selectedMethod === 'Referência Multicaixa'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 ring-1 ring-[var(--accent-primary)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-600 text-white">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm uppercase">Referência Multicaixa</span>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Gera Entidade e Referência para pagamento no ATM ou Internet Banking
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === 'Referência Multicaixa'}
                    onChange={() => setSelectedMethod('Referência Multicaixa')}
                    className="w-5 h-5 accent-[var(--accent-primary)]"
                  />
                </label>

                <label
                  onClick={() => setSelectedMethod('Dinheiro na Entrega')}
                  className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                    selectedMethod === 'Dinheiro na Entrega'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 ring-1 ring-[var(--accent-primary)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <span className="font-bold text-sm uppercase">Dinheiro ou TPA na Entrega</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedMethod === 'Dinheiro na Entrega'}
                    onChange={() => setSelectedMethod('Dinheiro na Entrega')}
                    className="w-5 h-5 accent-[var(--accent-primary)]"
                  />
                </label>
              </div>

              <div className="bg-[var(--bg-primary)] p-6 rounded-2xl border border-[var(--border-color)] mt-6 text-center">
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-bold mb-1">
                  Total a Cobrar
                </p>
                <p className="font-display text-4xl font-bold text-[var(--accent-primary)]">
                  {total.toLocaleString('pt-AO')} Kz
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" size="lg" className="flex-1 rounded-xl font-bold uppercase" onClick={handleBack} disabled={isProcessing}>
                  Voltar
                </Button>
                <Button
                  size="lg"
                  className="flex-1 rounded-xl font-bold uppercase shadow-xl"
                  onClick={handleCheckout}
                  isLoading={isProcessing}
                >
                  {selectedMethod === 'Multicaixa Express'
                    ? 'Enviar Débito Express'
                    : selectedMethod === 'Referência Multicaixa'
                    ? 'Gerar Referência'
                    : 'Finalizar Pedido'}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8 animate-in zoom-in-95 duration-500 space-y-6">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase mb-1">
                  Fome Resolvida! 🍔
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  O teu pedido <strong className="text-[var(--accent-primary)]">#{lastCreatedOrderNumber}</strong> foi registado com sucesso.
                </p>
              </div>

              {selectedMethod === 'Referência Multicaixa' && paymentResult?.reference && (
                <div className="max-w-md mx-auto bg-[var(--bg-primary)] border border-amber-500/40 rounded-2xl p-5 text-left space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Dados de Pagamento Multicaixa
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)]">Válido por 48h</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[var(--text-secondary)] block">Entidade</span>
                      <strong className="text-base text-white">{paymentResult.entity || '00112'}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--text-secondary)] block">Montante</span>
                      <strong className="text-base text-[var(--accent-primary)]">
                        {total.toLocaleString('pt-AO')} Kz
                      </strong>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-secondary)] block uppercase">Referência</span>
                      <span className="font-display font-bold text-lg tracking-wider text-white">
                        {paymentResult.reference}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyRefToClipboard(paymentResult.reference || '')}
                      className="text-xs uppercase font-bold"
                    >
                      {copiedRef ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-green-400" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" /> Copiar
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Paga em qualquer Caixa Multicaixa (Pagamento de Serviços) ou aplicativo Multicaixa Express / Internet Banking.
                  </p>
                </div>
              )}

              {selectedMethod === 'Multicaixa Express' && (
                <div className="max-w-md mx-auto bg-[var(--bg-primary)] border border-emerald-500/40 rounded-2xl p-4 text-xs text-emerald-300 space-y-1">
                  <p className="font-bold flex items-center justify-center gap-1.5">
                    <Clock className="w-4 h-4" /> Notificação enviada para {mcxPhone}
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Abre agora o teu aplicativo Multicaixa Express e insere o teu PIN para confirmar o pagamento de{' '}
                    <strong className="text-white">{total.toLocaleString('pt-AO')} Kz</strong>.
                  </p>
                </div>
              )}

              <div className="inline-flex items-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] px-5 py-2.5 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-xs uppercase tracking-wider">+150 Faminto Points Adicionados!</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <a
                  href={`https://wa.me/244923456789?text=${encodeURIComponent(
                    `Olá Burguer Faminto! Acabei de fazer o pedido #${lastCreatedOrderNumber} no valor de ${total.toLocaleString(
                      'pt-AO'
                    )} Kz. Podem confirmar a preparação?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" /> Acompanhar no WhatsApp
                </a>

                <Button size="lg" asChild className="rounded-xl uppercase font-bold text-xs">
                  <Link href="/perfil">Ver no Meu Perfil</Link>
                </Button>

                <Button size="lg" variant="outline" asChild className="rounded-xl uppercase font-bold text-xs">
                  <Link href="/menu">Pedir Mais Itens</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
