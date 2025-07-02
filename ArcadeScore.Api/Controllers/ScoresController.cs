using System;
using System.Collections.Generic;
using System.Linq;
using ArcadeScore.Api.Models;
using ArcadeScore.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeScore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoresController : ControllerBase
    {
        private static readonly ScoreRepository _repository = new ScoreRepository();

        [HttpPost]
        public IActionResult RegisterScore([FromBody] ScoreInputDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entry = new ScoreEntry
            {
                Date = DateTime.Now,
                Score = dto.Score,
                Player = dto.Player
            };

            _repository.Add(entry);

            return Ok(new
            {
                Date = entry.Date.ToString("dd/MM/yyyy HH:mm:ss"),
                Score = entry.Score,
                Player = entry.Player
            });
        }


        [HttpGet("ranking")]
        public IActionResult GetRanking()
        {
            var topScores = _repository.GetTopScores(10);
            return Ok(topScores);
        }

        [HttpGet("player/{player}")]
        public IActionResult GetPlayerStats(string player)
        {
            var scores = _repository.GetByPlayer(player);
            if (!scores.Any())
                return NotFound("Jogador não encontrado.");

            int record = int.MinValue;
            int timesBrokeRecord = 0;
            foreach (var s in scores)
            {
                if (s.Score > record)
                {
                    record = s.Score;
                    timesBrokeRecord++;
                }
            }

            var firstDate = scores.Min(s => s.Date);
            var lastDate = scores.Max(s => s.Date);
            var timePlaying = lastDate - firstDate;

            var stats = new PlayerStatsDto
            {
                Player = player,
                TotalGames = scores.Count,
                AverageScore = Math.Round(scores.Average(s => s.Score), 2),
                HighestScore = scores.Max(s => s.Score),
                LowestScore = scores.Min(s => s.Score),
                TimesBrokeRecord = timesBrokeRecord,
                TimePlaying = $"{(int)timePlaying.TotalDays / 30} meses"
            };

            return Ok(stats);
        }
    }
}
