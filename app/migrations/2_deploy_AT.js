const ArtToken = artifacts.require('./ArtToken.sol')
const fs = require('fs')

module.exports = function (deployer) {
  // 배포시 name, symbol 정의
  var name = "Art Token";
  var symbol = "AT";

  deployer.deploy(ArtToken, name, symbol)
    .then(() => {
      if (ArtToken._json) {
        fs.writeFile(
          'deployedABI',
          JSON.stringify(ArtToken._json.abi),
          (err) => {
            if (err) throw err
            console.log("파일에 ABI 입력 성공");
          })
      }

      fs.writeFile(
        'deployedAddress',
        ArtToken.address,
        (err) => {
          if (err) throw err
          console.log("파일에 주소 입력 성공");
        })
    })
}