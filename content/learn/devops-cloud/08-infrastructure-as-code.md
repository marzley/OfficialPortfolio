---
slug: infrastructure-as-code
title: "Infrastructure as code: Terraform and Ansible (servers built from files, not clicks)"
after: kubernetes-basics
---
# Infrastructure as code: Terraform and Ansible (servers built from files, not clicks)

Clicking around a cloud console is fine for learning. But for real systems you need to rebuild environments exactly, review changes and recover after disasters. **Infrastructure as code (IaC)** describes your servers, networks and databases in text files kept in Git.

## Why IaC?

| Without IaC | With IaC |
|---|---|
| "Who changed the firewall last week?" | Every change is a reviewed Git commit |
| Staging and production slowly drift apart | Both built from the same code |
| Rebuilding after a disaster takes days | Run the code again |
| Knowledge lives in one person's head | It's written down and versioned |

## Two kinds of tools

| Tool | Main job | Style |
|---|---|---|
| **Terraform** (or the open-source fork **OpenTofu**) | Create cloud resources: networks, servers, databases, DNS | Declarative: describe the end state |
| **Ansible** | Configure servers: install packages, edit files, deploy apps | Runs tasks over SSH, no agent needed |
| Cloud-specific | AWS CloudFormation / CDK, Azure Bicep, Google Cloud Deployment Manager | Tied to one provider |
| Pulumi | IaC in general-purpose languages (Python, TypeScript) | Declarative, code-based |

## Terraform example

```hcl
# main.tf
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  default = "af-south-1"   # Cape Town; choose the region that fits your users and rules
}

resource "aws_s3_bucket" "backups" {
  bucket = "marzley-shop-backups-2026"
}

resource "aws_s3_bucket_public_access_block" "backups" {
  bucket                  = aws_s3_bucket.backups.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "bucket_name" {
  value = aws_s3_bucket.backups.bucket
}
```

The workflow:

```bash
terraform init      # download providers
terraform fmt       # tidy the code
terraform plan      # preview what will change (read this carefully!)
terraform apply     # make the changes
terraform destroy   # delete everything (great for practice environments)
```

**State:** Terraform keeps a **state file** recording what it created. In teams, store state remotely (an S3 bucket, Azure Storage, Terraform Cloud) with locking, and never commit it to Git: it can contain secrets.

**Modules** package reusable pieces (e.g. a standard VPC) so every project builds networks the same way.

## Ansible example

```yaml
# playbook.yml: configure web servers
- hosts: web
  become: true
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
        update_cache: true

    - name: Copy site configuration
      template:
        src: shop.conf.j2
        dest: /etc/nginx/sites-available/shop.conf
      notify: Reload nginx

    - name: Enable the site
      file:
        src: /etc/nginx/sites-available/shop.conf
        dest: /etc/nginx/sites-enabled/shop.conf
        state: link
      notify: Reload nginx

  handlers:
    - name: Reload nginx
      service:
        name: nginx
        state: reloaded
```

```bash
ansible-playbook -i inventory.ini playbook.yml
```

Ansible tasks are **idempotent**: running the playbook twice gives the same result, changing only what's needed.

## Good IaC practices

1. **Everything in Git**, changed through pull requests.
2. **Always read `terraform plan`** before applying; look for unexpected deletions.
3. **Remote state with locking**; never commit state or secrets.
4. **Separate environments** (dev, staging, production) with variables or workspaces.
5. **Run IaC in CI/CD:** plan on every PR, apply after approval.
6. **Tag resources** (project, owner, environment) to track costs.

:::think A teammate fixes a production problem by changing a firewall rule by hand in the console. Next week, someone runs terraform apply. What happens, and what's the right process?
Terraform sees the manual change as drift and may revert it to what the code says, bringing the problem back. The right process: make the fix in the Terraform code through a pull request, review the plan, then apply, so code and reality stay the same.
:::

## Summary

- IaC describes infrastructure in versioned files: reviewable, repeatable and recoverable.
- Terraform (or OpenTofu) creates cloud resources declaratively: init, plan, apply, destroy.
- Ansible configures servers with idempotent tasks over SSH.
- Keep code in Git, read plans carefully, use remote state and run IaC through CI/CD.

```quiz
Q: Which Terraform command previews changes before applying them? (write like terraform plan)
A: terraform plan | plan
Q: Running an Ansible playbook twice gives the same result. What is this property called? (one word)
A: idempotent | idempotency
Q: Should the Terraform state file be committed to Git? (yes or no)
A: no
```
