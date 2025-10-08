using AutoMapper;
using Comments.API.Contracts;
using Comments.Core.Entities;

namespace Comments.API.Mapping;

public class CommentMappingProfile : Profile
{
    public CommentMappingProfile()
    {
        CreateMap<Comment, GetCommentResponse>();

        CreateMap<CreateCommentRequest, Comment>()
            .ConstructUsing(src =>
                Comment.Create(
                    src.Username,
                    src.Email,
                    HtmlSanitizerUtil.Sanitize(src.Text),
                    src.ParentId,
                    src.HomePage,
                    src.FilePath,
                    DateTime.UtcNow
                )
            );
    }
}