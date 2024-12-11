module "dns_zone" {
  source = "./modules/dns"

  domain = "domain.tld"
  record_sets = [
    {
      name = "mysubdomain"
      type = "A"
      records = [
        "1.2.3.4",
        "5.6.7.8"
      ]
    },
    {
      name = "mysubdomain"
      type = "AAAA"
      records = [
        "fe80::0001",
        "fe80::0002"
      ]
    }
  ]
}

module "record_sets" {
  source = "./modules/dns//modules/record_sets"

  domain = module.dns_zone.domain
  name = "anothersubdomain"
  type = "CNAME"
  records = [
    "mysubdomain.${module.dns_zone.domain}"
  ]
}
