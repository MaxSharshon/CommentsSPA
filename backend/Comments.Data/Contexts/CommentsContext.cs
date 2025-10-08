using Comments.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Comments.Data.Contexts;

public class CommentsContext(DbContextOptions<CommentsContext> options) : DbContext(options)
{
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Comment>(b =>
        {
            b.HasKey(c => c.Id);
            b.Property(c => c.Text).HasMaxLength(CommentConstraints.MAX_TEXT_LENGTH).IsRequired();
            b.Property(c => c.Username).HasMaxLength(CommentConstraints.MAX_USERNAME_LENGTH).IsRequired();
            b.Property(c => c.Email).HasMaxLength(CommentConstraints.MAX_EMAIL_LENGTH).IsRequired();
            b.Property(c => c.HomePage).HasMaxLength(CommentConstraints.MAX_HOME_PAGE_LENGTH);
            b.Property(c => c.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(c => c.Parent)
             .WithMany(p => p.Replies)
             .HasForeignKey(c => c.ParentId)
             .OnDelete(DeleteBehavior.Restrict);
            b.HasIndex(c => c.CreatedAt);
            b.HasIndex(c => c.ParentId);
            b.HasIndex(c => new { c.ParentId, c.CreatedAt });
        });
        
        base.OnModelCreating(modelBuilder);
    }
}