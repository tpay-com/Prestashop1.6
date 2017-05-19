{*
* NOTICE OF LICENSE
*
* This file is licenced under the Software License Agreement.
* With the purchase or the installation of the software in your application
* you accept the licence agreement.
*
* You must not modify, adapt or create derivative works of this source code
*
*  @author    tpay.com
*  @copyright 2010-2016 tpay.com
*  @license   LICENSE.txt
*}
{if $blikOn==true && $autoSubmit==false}
    <script type="text/javascript">


        function content() {
            document.getElementById("content").innerHTML = "{l s='Confirm your order now.' mod='tpay'}";
            document.getElementById("insidebg").innerHTML = "";
            document.getElementById("bank-selection-form").innerHTML = "";
        }



    </script>
    <div id="input_container_blik" class="insidebg">
        <div id="content">


                        <form class="tpay-form" id="blikForm" name="blikForm" action="{$link->getModuleLink('tpay', 'blik', [], true)|escape:'htmlall':'UTF-8'}" onsubmit="content()">
                            {l s='Type your 6 digit blik code or choose standard payment channel' mod='tpay'}<br/>
                            {html_image file='https://secure.transferuj.pl/_/banks/b64.png'}

                            <input type="text" name="blikCode" value="" id="blikCode" maxlength="6" title="{l s='Blik code should contain 6 digits' mod='tpay'}"/>

                        <br/>{l s='Using this payment method you confirm acceptance of the ' mod='tpay'} <a href="{$paymentConfig.regulation_url|escape:'htmlall':'UTF-8'}" target="_blank">{l s='regulations' mod='tpay'}</a>
                        {foreach from=$paymentConfig key=name item=value}
                            {if $name eq 'kanal'}
                                {assign 'value' '64'}
                            {elseif $name eq 'akceptuje_regulamin'}
                                {assign 'value' '1'}
                            {else}
                                {assign 'id' ''}
                            {/if}
                            <input type="hidden" value="{$value|escape:'htmlall':'UTF-8'}" name="{$name|escape:'htmlall':'UTF-8'}" {if $id}id="{$id|escape:'htmlall':'UTF-8'}"{/if}>
                        {/foreach}

                        <input id="tpay-blik-submit" class="button_blik" type="submit" value="{l s='Pay by blik' mod='tpay'}" />

                </form>

        </div>
    </div>
{/if}