$(function () {
  var loader = $('.loading-container');
  $('#faucetForm').submit(function (e) {
    e.preventDefault();
    $this = $(this);
    loader.removeClass('hidden');
    var receiver = $('#receiver').val();
    var captcha = $('#g-recaptcha-response').val();
    var tokenAddress = $('#tokenList').val();
    var tokenRawText = $('#tokenList option:selected').text();
    var tokenName = /[A-Z]+$/g.exec(tokenRawText)[0];
    $.ajax({
      url: '/',
      type: 'POST',
      data: {
        receiver: receiver,
        captcha: captcha,
        tokenAddress: tokenAddress,
      },
    })
      .done(function (data) {
        if (!data.success) {
          loader.addClass('hidden');
          swal(data.error.title, data.error.message, 'error');
          return;
        }

        getTxCallBack(data.success.txHash, function () {
          $('#receiver').val('');
          loader.addClass('hidden');
          var amount = tokenAddress === '0x0' ? '1' : '100';
          swal(
            'Success',
            `<span style="color:#FF6D3E;font-weight:bold;">${amount} ${tokenName}</span> is successfully transfered to ` +
              receiver +
              " in Tx<br /><a style='color:#FF6D3E' href='https://scan.testnet.myubi.io/txs/" +
              data.success.txHash +
              "' target='_blank'>" +
              data.success.txHash +
              '</a>',
            'success'
          );
          grecaptcha.reset();
        });
      })
      .fail(function (err) {
        loader.addClass('hidden');
      });
  });
});
