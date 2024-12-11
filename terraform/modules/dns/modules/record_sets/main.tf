resource "record_set" "this" {
  name    = "${var.name}.${data.dns_zone.this.domain}"
  type    = var.type
  ttl     = var.ttl
  records = var.records
}
