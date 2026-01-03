# my-island AWS Hosting Cost Estimate

> [!info] Overview
> Infrastructure cost analysis for hosting the my-island booking platform on AWS, broken down by growth phase.

---

## Infrastructure Components Required

| Component | AWS Service | Purpose |
|-----------|-------------|---------|
| Database | RDS PostgreSQL 17 | User data, bookings, campsites |
| Object Storage | S3 | Campsite images, uploads |
| Email | SES | Booking confirmations, notifications |
| Event Stream | MSK (Kafka) | Async booking/notification events |
| Application | EC2 or ECS | Spring Boot API (Java 25) |
| Frontend | S3 + CloudFront | React static files + CDN |
| Monitoring | CloudWatch | Logs, metrics, alarms |
| DNS | Route 53 | Domain management |
| Secrets | Secrets Manager | API keys, DB credentials |

---

## Tier 1: MVP / Launch Phase (50 properties)

*Minimal viable infrastructure using free tier where possible*

| Service | Spec | Monthly Cost |
|---------|------|--------------|
| **EC2** (API) | t3.micro (free tier Y1) or t3.small | €0-15 |
| **RDS PostgreSQL** | db.t3.micro, 20GB (free tier Y1) | €0-25 |
| **S3** | 5GB storage, 10GB transfer | €2 |
| **SES** | ~1,500 emails/month | €0.15 |
| **CloudFront** | 10GB transfer | €1 |
| **Route 53** | 1 hosted zone | €0.50 |
| **Secrets Manager** | 3 secrets | €1.20 |
| **CloudWatch** | Basic logs/metrics | €5 |
| **No Kafka** | Use sync processing initially | €0 |
| | | |
| **Total (Free Tier Year 1)** | | **~€10-25/month** |
| **Total (Post Free Tier)** | | **~€50-80/month** |

> [!tip] Cost Saving
> Skip MSK (Kafka) initially - process events synchronously. Add Kafka when scale requires async processing.

### MVP Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  CloudFront │────▶│     S3      │     │   Route 53  │
│    (CDN)    │     │  (Frontend) │     │    (DNS)    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────▶│  EC2/t3.sm  │────▶│     RDS     │
│  (Browser)  │     │ Spring Boot │     │  PostgreSQL │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
             ┌──────────┐  ┌──────────┐
             │    S3    │  │   SES    │
             │ (Images) │  │ (Email)  │
             └──────────┘  └──────────┘
```

---

## Tier 2: Growth Phase (150-250 properties)

*Production-ready with redundancy*

| Service | Spec | Monthly Cost |
|---------|------|--------------|
| **EC2** (API) | t3.small (2 vCPU, 2GB RAM) | €18 |
| **RDS PostgreSQL** | db.t3.small, 50GB gp3, Multi-AZ | €65 |
| **S3** | 20GB storage, 50GB transfer | €5 |
| **SES** | ~5,000 emails/month | €0.50 |
| **CloudFront** | 50GB transfer | €5 |
| **ALB** | Application Load Balancer | €20 |
| **Route 53** | 1 hosted zone + health checks | €2 |
| **Secrets Manager** | 5 secrets | €2 |
| **CloudWatch** | Logs + custom metrics + alarms | €25 |
| **MSK Serverless** | Low-throughput Kafka | €50 |
| | | |
| **Total** | | **~€190-220/month** |

---

## Tier 3: Scale Phase (500+ properties)

*High availability, auto-scaling*

| Service | Spec | Monthly Cost |
|---------|------|--------------|
| **EC2 Auto Scaling** | 2x t3.medium (avg) | €75 |
| **RDS PostgreSQL** | db.t3.medium, 100GB, Multi-AZ | €130 |
| **S3** | 50GB storage, 200GB transfer | €15 |
| **SES** | ~20,000 emails/month | €2 |
| **CloudFront** | 200GB transfer | €20 |
| **ALB** | With WAF | €45 |
| **Route 53** | Hosted zone + health checks | €5 |
| **Secrets Manager** | 10 secrets | €4 |
| **CloudWatch** | Full observability stack | €50 |
| **MSK** | 2 broker kafka.t3.small | €120 |
| **ElastiCache** | Redis t3.micro (optional) | €15 |
| | | |
| **Total** | | **~€450-550/month** |

### Scale Architecture

```
                    ┌─────────────┐
                    │  Route 53   │
                    │    (DNS)    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  CloudFront │
                    │    (CDN)    │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌─────────────┐           ┌─────────────┐
       │     S3      │           │     ALB     │
       │  (Frontend) │           │   + WAF     │
       └─────────────┘           └──────┬──────┘
                                        │
                         ┌──────────────┼──────────────┐
                         ▼              ▼              ▼
                  ┌──────────┐   ┌──────────┐   ┌──────────┐
                  │   EC2    │   │   EC2    │   │   EC2    │
                  │ (API 1)  │   │ (API 2)  │   │ (API n)  │
                  └────┬─────┘   └────┬─────┘   └────┬─────┘
                       └──────────────┼──────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
       ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
       │     RDS     │         │     MSK     │         │ ElastiCache │
       │  Multi-AZ   │         │   (Kafka)   │         │   (Redis)   │
       └─────────────┘         └─────────────┘         └─────────────┘
```

---

## Tier 4: Full Ireland Market (1,500 properties)

*Enterprise-grade infrastructure*

| Service | Spec | Monthly Cost |
|---------|------|--------------|
| **ECS Fargate** | 4 tasks avg | €150 |
| **RDS PostgreSQL** | db.r6g.large, 250GB, Multi-AZ | €350 |
| **S3** | 200GB + lifecycle policies | €30 |
| **SES** | ~50,000 emails/month | €5 |
| **CloudFront** | 500GB + Shield | €60 |
| **ALB** | With WAF + Shield | €80 |
| **Route 53** | Full DNS + failover | €10 |
| **Secrets Manager** | 15 secrets | €6 |
| **CloudWatch** | Full stack + X-Ray | €100 |
| **MSK** | 3 broker kafka.m5.large | €300 |
| **ElastiCache** | Redis r6g.large cluster | €150 |
| **Backup** | Automated backups | €50 |
| | | |
| **Total** | | **~€1,200-1,500/month** |

---

## Cost vs Revenue Analysis

> [!success] Excellent Margins
> Infrastructure costs represent only **2-3% of revenue** at all scales.

| Phase | Properties | AWS Cost/Month | Revenue/Month (60% occ) | Margin |
|-------|------------|----------------|-------------------------|--------|
| **MVP** | 50 | €25-80 | €2,683 | 97% |
| **Growth** | 150-250 | €190-220 | €8,050-13,417 | 97-98% |
| **Scale** | 500 | €450-550 | €26,833 | 98% |
| **Full Market** | 1,500 | €1,200-1,500 | €80,499 | 98% |

### Infrastructure as % of Revenue

```
MVP:         ██ 3%
Growth:      ██ 2%
Scale:       ██ 2%
Full Market: ██ 2%
```

---

## Cost Optimization Strategies

### Reserved Instances & Savings Plans

| Strategy | Savings | Best For |
|----------|---------|----------|
| **EC2 Reserved (1-year)** | 30-40% | Predictable baseline |
| **EC2 Reserved (3-year)** | 50-60% | Long-term commitment |
| **Spot Instances** | 60-90% | Non-critical batch jobs |
| **RDS Reserved (1-year)** | 30% | Database costs |
| **Savings Plans** | 20-30% | Flexible commitment |

### Architecture Optimizations

| Change | Monthly Savings |
|--------|-----------------|
| Skip Kafka initially (sync processing) | €50-300 |
| Use S3 Intelligent Tiering | 10-20% on storage |
| CloudFront caching (reduce origin) | 20-40% on transfer |
| Right-size RDS during off-peak | 20-30% |
| Use ARM instances (Graviton) | 20% on compute |

### Free Tier Maximization (Year 1)

| Service | Free Tier Allowance |
|---------|---------------------|
| EC2 | 750 hours/month t2.micro |
| RDS | 750 hours/month db.t2.micro, 20GB |
| S3 | 5GB storage, 20K GET, 2K PUT |
| CloudFront | 1TB transfer, 10M requests |
| SES | 62,000 emails/month (from EC2) |
| Lambda | 1M requests, 400K GB-seconds |

---

## Alternative Hosting Options

### Simplified Stack (Lower Cost)

| Provider | Monthly Cost | Notes |
|----------|--------------|-------|
| **Railway** | €20-50 | All-in-one, great DX |
| **Render** | €25-75 | Easy deployment |
| **Fly.io** | €20-60 | Edge deployment |
| **DigitalOcean** | €30-80 | Simpler than AWS |

### Component Alternatives

| AWS Service | Alternative | Cost Impact |
|-------------|-------------|-------------|
| MSK (Kafka) | SQS + SNS | €50-300 → €5-20 |
| RDS | Supabase/Neon | Similar, easier |
| SES | Resend/Postmark | Similar, better DX |
| CloudWatch | Grafana Cloud | Free tier available |

---

## Database Sizing Estimates

### Storage Growth Projection

| Scale | Users | Campsites | Bookings/Year | DB Size |
|-------|-------|-----------|---------------|---------|
| MVP | 1,000 | 50 | 5,000 | 1-2 GB |
| Growth | 5,000 | 250 | 25,000 | 5-10 GB |
| Scale | 20,000 | 500 | 100,000 | 20-50 GB |
| Full | 50,000 | 1,500 | 300,000 | 100-200 GB |

### RDS Instance Recommendations

| Scale | Instance | vCPU | RAM | IOPS |
|-------|----------|------|-----|------|
| MVP | db.t3.micro | 2 | 1GB | Burst |
| Growth | db.t3.small | 2 | 2GB | Burst |
| Scale | db.t3.medium | 2 | 4GB | Burst |
| Full | db.r6g.large | 2 | 16GB | Provisioned |

---

## S3 Storage Estimates

### Image Storage

| Item | Size | Quantity | Total |
|------|------|----------|-------|
| Campsite image | 1-3 MB | 5 per site | 5-15 MB/site |
| User avatar | 100 KB | 1 per user | 100 KB/user |
| Booking docs | 500 KB | 1 per booking | 500 KB/booking |

### Projected Storage by Scale

| Scale | Campsites | Users | Storage |
|-------|-----------|-------|---------|
| MVP | 50 | 1,000 | 500 MB |
| Growth | 250 | 5,000 | 2-3 GB |
| Scale | 500 | 20,000 | 10-15 GB |
| Full | 1,500 | 50,000 | 50-75 GB |

---

## Monthly Cost Summary

| Scale | Properties | Monthly Cost | Annual Cost |
|-------|------------|--------------|-------------|
| **MVP (Free Tier)** | 50 | €10-25 | €120-300 |
| **MVP (Post Free Tier)** | 50 | €50-80 | €600-960 |
| **Growth** | 250 | €190-220 | €2,280-2,640 |
| **Scale** | 500 | €450-550 | €5,400-6,600 |
| **Full Market** | 1,500 | €1,200-1,500 | €14,400-18,000 |

---

## Key Takeaways

> [!abstract] Summary
> 1. **Start cheap**: MVP runs for €10-25/month using AWS Free Tier
> 2. **Scale efficiently**: Costs grow sub-linearly with users
> 3. **High margins**: Infrastructure is <3% of revenue at all scales
> 4. **Optimize later**: Skip Kafka/Redis until you need async processing
> 5. **Reserved savings**: 30-40% savings available with 1-year commitments

---

## Sources

- [AWS Pricing Calculator](https://calculator.aws/)
- [AWS RDS PostgreSQL Pricing](https://aws.amazon.com/rds/postgresql/pricing/)
- [AWS EC2 Pricing](https://aws.amazon.com/ec2/pricing/)
- [AWS re:Post - Cost-Effective Deployment](https://repost.aws/questions/QUaaU1reYGTNiOph4JSPkyiA/cost-effective-deployment-of-angular-spring-boot-postgresql-application-on-aws)

---

#aws #infrastructure #costs #my-island #hosting
