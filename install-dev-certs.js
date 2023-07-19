import mkcert from 'mkcert'
import fs from 'node:fs'

(async () => {
  // create a certificate authority
  const ca = await mkcert.createCA({
    organization: 'Local CA',
    countryCode: 'US',
    state: 'local',
    locality: 'host',
    validityDays: 365
  });

  // then create a tls certificate
  const cert = await mkcert.createCert({
    domains: ['127.0.0.1', 'localhost', 'local.transgender.org', '*.transgender.org'],
    validityDays: 365,
    caKey: ca.key,
    caCert: ca.cert
  });

  fs.writeFileSync (
    './localhost-key.pem', cert.key
  )
  fs.writeFileSync (
    './localhost.pem', cert.cert
  )
  fs.writeFileSync (
    './rootCA.pem', ca.cert
  )
  console.log(cert.key, cert.cert); // certificate info
  console.log(`${cert.cert}\n${ca.cert}`); // create a full chain certificate by merging CA and domain certificates

})()