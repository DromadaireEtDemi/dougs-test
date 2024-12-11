resource "dns_zone" "this" {
  domain = var.zone_domain
}

module "record_sets" {
  source = "./modules/record_sets"
  for_each = {
    for record in var.recordsets : join("/", [record.name, record.type]) => record
  }

  from_parent = true
  domain = dns_zone.this.domain
  name      = each.value.name
  type      = each.value.type
  ttl       = each.value.ttl
  records   = each.value.records
}
