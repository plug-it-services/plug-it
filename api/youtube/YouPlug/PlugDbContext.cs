﻿using Microsoft.EntityFrameworkCore;
using YouPlug.Models;

namespace YouPlug
{
    public class PlugDbContext : DbContext
    {
        public PlugDbContext(DbContextOptions<PlugDbContext> options) : base(options)
        {
        }
        
        public DbSet<YouPlugAuth> Auths { get; set; }
        public DbSet<WebHookModel> WebHooks { get; set; }
    }
}