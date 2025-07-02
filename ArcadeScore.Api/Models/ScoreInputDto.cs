using System;
using System.ComponentModel.DataAnnotations;

namespace ArcadeScore.Api.Models
{
    public class ScoreInputDto
    {
        
  

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "A pontuação deve ser um número não negativo.")]
        public int Score { get; set; }

        [Required]
        [MinLength(2)]
        public string Player { get; set; }
    }
}

