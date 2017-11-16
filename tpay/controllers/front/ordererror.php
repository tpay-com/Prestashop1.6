<?php
/**
 * NOTICE OF LICENSE.
 *
 * This file is licenced under the Software License Agreement.
 * With the purchase or the installation of the software in your application
 * you accept the licence agreement.
 *
 * You must not modify, adapt or create derivative works of this source code
 *
 * @author    tpay.com
 * @copyright 2010-2016 tpay.com
 * @license   LICENSE.txt
 */

/**
 * Class TpayOrderErrorModuleFrontController.
 */
class TpayOrderErrorModuleFrontController extends ModuleFrontController
{
    public function initContent()
    {
        $this->emptyCart();
        $this->context->cookie->__unset('last_order');
        $this->context->cookie->last_order = false;
        $this->cartId = 0;
        $this->context->controller->addCss(_MODULE_DIR_ . 'tpay/views/css/style.css');
        $this->display_column_left = false;
        $googleId = Configuration::get('TPAY_GOOGLE_ID');

        if (!empty($googleId)) {
            $smarty_data = array(
                'google_id' => $googleId,
                'linker'    => '{\'allowLinker\': true}'
            );
            $this->context->smarty->assign($smarty_data);
        }

        parent::initContent();
        $this->setTemplate('orderError.tpl');
    }

    private function emptyCart()
    {
        $products = $this->context->cart->getProducts();
        foreach ($products as $product) {
            $this->context->cart->deleteProduct($product['id_product']);
        }
    }

}
