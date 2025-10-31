using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace DemoStrategy3D.Strategy
{
    public class DroneContext
    {
        private IDirectionStrategy? _strategy;

        public void SetDirectionStrategy(StrategyType type)
        {
            _strategy = type switch
            {
                StrategyType.MoveForward => new MoveForwardStrategy(),
                StrategyType.TurnLeft => new TurnLeftStrategy(),
                StrategyType.TurnRight => new TurnRightStrategy(),
                _ => null
            };
        }

        public async Task MoveAsync(IJSRuntime js)
        {
            if (_strategy != null)
                await _strategy.ExecuteAsync(js);
        }
    }
}
