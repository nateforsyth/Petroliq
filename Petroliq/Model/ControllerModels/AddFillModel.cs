namespace Petroliq_API.Model.ControllerModels
{
    /// <summary>
    /// Add Fill Model
    /// </summary>
    public class AddFillModel
    {
        /// <summary>
        /// Date of the Fill up
        /// </summary>
        public DateTime FillDate { get; set; } = DateTime.Now;

        /// <summary>
        /// Start Odometer reading
        /// </summary>
        public decimal StartOdo { get; set; }

        /// <summary>
        /// End Odometer reading
        /// </summary>
        public decimal EndOdo { get; set; }

        /// <summary>
        /// Volume of Fuel delivered, in Shared.Enums.CapacityUnit
        /// </summary>
        public decimal Volume { get; set; }

        /// <summary>
        /// Discount applied to this Fill up
        /// </summary>
        public decimal Discount { get; set; }

        /// <summary>
        /// Whether or not the currently accrued Discount has been cashed
        /// </summary>
        public bool DiscountCashed { get; set; } = false;

        /// <summary>
        /// Spot price per Shared.Enums.CapacityUnit, in Shared.Enums.CurrencyUnit
        /// </summary>
        public decimal UnitSpotPrice { get; set; } = 0;
    }
}
