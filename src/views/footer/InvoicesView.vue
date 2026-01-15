<template>
  <div class="legal-container">
    <div class="legal-content">
      <h1 class="text-orange">Facturación</h1>
      
      <section>
        <h2>📥 Descarga de Facturas</h2>
        <p>
          Puedes acceder a todas tus facturas desde tu <strong>Área de Cliente</strong>. 
          Una vez dentro, dirígete a la sección "Mis Pedidos", donde encontrarás el icono de descarga PDF junto a cada compra finalizada.
        </p>
      </section>

      <section>
        <h2>🏢 Facturas para Empresas</h2>
        <p>
          Si necesitas una factura completa a nombre de tu empresa o autónomo, asegúrate de rellenar los datos fiscales (CIF/NIF, Razón Social y Dirección Fiscal) 
          en tu perfil antes de realizar el pedido.
        </p>
        <p>Si olvidaste hacerlo, puedes solicitar la modificación contactando con soporte en los 7 días posteriores a la compra.</p>
      </section>

      <section>
        <h2>📊 Impuestos (IVA)</h2>
        <p>
          Todos los precios mostrados en nuestra web <strong>incluyen el IVA</strong> vigente en España (21% tipo general). 
          En el resumen del pedido y en la factura final verás el desglose detallado de la base imponible y la cuota tributaria.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.legal-container { 
    min-height: 80vh; 
    padding: 4rem 2rem; 
    background-color: #f8f9fa; 
    display: flex; 
    justify-content: center; 
}

.legal-content { 
    max-width: 900px; 
    background: white; 
    padding: 3rem; 
    border-radius: 12px; 
    box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
}

.text-orange { 
    color: #F97316; 
    font-weight: 800; 
    margin-bottom: 2rem; 
    text-transform: uppercase; 
    letter-spacing: -0.5px; 
    border-bottom: 3px solid #F97316; 
    display: inline-block; padding-bottom: 0.5rem; 
}

h2 { 
    color: #333; 
    margin-top: 2.5rem; 
    margin-bottom: 1rem; 
    font-size: 1.5rem; 
}

p { 
    line-height: 1.8; 
    color: #555; 
    font-size: 1.05rem; 
}

strong { 
    color: #2c3e50; 
}
</style>