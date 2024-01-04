namespace Petroliq_API.Model
{
    public class PetroliqOverview(string name)
    {
        public string Name { get; set; } = name;


        public class Fill
        {
            public int Id { get; set; }
            public DateTime FillDate { get; set; }
            public float Capacity { get; set; }
            public float UnitPrice { get; set; }
            public float TotalPrice { get; set; }
        }

        
    }
}
