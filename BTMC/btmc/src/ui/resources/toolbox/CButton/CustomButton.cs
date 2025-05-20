using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.resources.toolbox.CButton
{
    public class CustomButton : System.Windows.Controls.Button
    {
        static CustomButton()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(CustomButton),
                new FrameworkPropertyMetadata(typeof(CustomButton)));
        }
        public static readonly DependencyProperty CornerRadiusProperty =
    DependencyProperty.Register(nameof(CornerRadius), typeof(CornerRadius), typeof(CustomButton), new PropertyMetadata(new CornerRadius(0)));

        public CornerRadius CornerRadius
        {
            get => (CornerRadius)GetValue(CornerRadiusProperty);
            set => SetValue(CornerRadiusProperty, value);
        }

    }
}
